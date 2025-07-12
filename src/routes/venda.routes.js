import express from 'express';
import Venda from '../models/Venda.js';

const router = express.Router();

// rota de cadatrar a venda
router.post("/", async (req, res) => {
    try {
        const {
            clienteId,
            usuarioId,
            itens,
            formaPagamento,
            entrada = 0,
            parcelas = 1,
            dataVencimento,
            desconto = 0,
            acrescimo = 0,
            descricao,
            subtotal,
            valorRestante,
            total,
            status,
            dataHora
        } = req.body;

        // Gerar parcelasDetalhes se for cred-loja
        let parcelasDetalhes = [];

        if (formaPagamento === "cred-loja" && parcelas > 0 && dataVencimento) {
            const valorParcela = Number(((total - entrada) / parcelas).toFixed(2));
            const dataBase = new Date(dataVencimento);

            for (let i = 0; i < parcelas; i++) {
                const vencimento = new Date(dataBase);
                vencimento.setMonth(vencimento.getMonth() + i);

                parcelasDetalhes.push({
                    numero: i + 1,
                    valor: valorParcela,
                    dataVencimento: vencimento,
                    status: "pendente",
                });
            }
        }

        const novaVenda = new Venda({
            clienteId,
            usuarioId,
            itens,
            formaPagamento,
            entrada,
            parcelas,
            dataVencimento,
            parcelasDetalhes,
            desconto,
            acrescimo,
            descricao,
            subtotal,
            valorRestante,
            total,
            status: formaPagamento === "cred-loja" ? "pendente" : status,
            dataHora: dataHora || new Date(),
        });

        const vendaSalva = await novaVenda.save();

        return res.status(201).json({
            error: false,
            mensagem: "Venda registrada com sucesso!",
            venda: vendaSalva,
        });
    } catch (erro) {
        console.error("Erro ao registrar venda:", erro);
        return res.status(500).json({
            error: true,
            mensagem: "Erro ao registrar venda.",
            detalhes: erro.message,
        });
    }
});


router.get("/cred-loja", async (req, res) => {
    try {
        const vendas = await Venda.find({ formaPagamento: "cred-loja" })
            .populate("clienteId", "nome") // busca o nome do cliente
            .sort({ dataHora: -1 });

        const dadosFormatados = vendas.map((venda) => ({
            id: venda._id,
            cliente: venda.clienteId?.nome || "Desconhecido",
            dataVenda: venda.dataHora,
            total: venda.total,
            parcelas: venda.parcelasDetalhes.map(p => ({
                numero: p.numero,
                valor: p.valor,
                vencimento: p.dataVencimento,
                pago: p.status === "pago"
            }))
        }));

        res.status(200).json({ error: false, vendas: dadosFormatados });
    } catch (err) {
        res.status(500).json({ error: true, mensagem: "Erro ao buscar carnês", detalhes: err.message });
    }
});

router.get('/pendentes', async (req, res) => {
    try {
        const vendasPendentes = await Venda.find({ status: 'pendente' })
            .populate('clienteId', 'nome') // só traz o nome do cliente
            .sort({ dataHora: -1 }); // ordena da mais recente para mais antiga

        const resposta = vendasPendentes.map(venda => ({
            id: venda._id,
            cliente: venda.clienteId ? venda.clienteId.nome : 'Desconhecido',
            dataVenda: venda.dataHora,
            total: venda.total,
            parcelas: venda.parcelasDetalhes?.map(parcela => ({
                numero: parcela.numero,
                valor: parcela.valor,
                vencimento: parcela.dataVencimento,
                pago: parcela.status === 'pago'
            }))
        }));

        res.json({ error: false, vendas: resposta });
    } catch (err) {
        console.error("Erro ao buscar vendas pendentes:", err);
        res.status(500).json({ error: true, mensagem: "Erro interno ao buscar vendas pendentes" });
    }
});

// PATCH /vendas/:id/parcela/:numero/pagar
router.patch("/:id/parcela/:numero/pagar", async (req, res) => {
    const { id, numero } = req.params;

    try {
        const venda = await Venda.findById(id);
        if (!venda) {
            return res.status(404).json({ error: true, mensagem: "Venda não encontrada" });
        }

        const parcela = venda.parcelasDetalhes.find(p => p.numero === parseInt(numero));
        if (!parcela) {
            return res.status(404).json({ error: true, mensagem: "Parcela não encontrada" });
        }

        // Marcar a parcela como paga
        parcela.status = "pago";
        parcela.dataPagamento = new Date();

        // Verificar se todas as parcelas estão pagas
        const todasPagas = venda.parcelasDetalhes.every(p => p.status === "pago");
        if (todasPagas) {
            venda.status = "finalizada";
        }

        await venda.save();

        return res.json({
            error: false,
            mensagem: todasPagas
                ? "Parcela paga e venda finalizada."
                : "Parcela paga com sucesso.",
            venda
        });
    } catch (err) {
        console.error("Erro ao pagar parcela:", err);
        return res.status(500).json({
            error: true,
            mensagem: "Erro ao atualizar parcela",
            detalhes: err.message
        });
    }
});



/*
router.get('/', async (req, res) => {
    try {
        const vendas = await Venda.find();
        res.json({ error: false, vendas });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
})
*/
// Listar todas as vendas
router.get("/", async (req, res) => {
    try {
        const vendas = await Venda.find()
            .populate("clienteId", "nome email telefone")   // traz dados do cliente
            .populate("usuarioId", "nome email")            // traz dados do usuário
            .populate("itens.produtoId", "nome preco");     // traz dados do produto

        return res.status(200).json({
            error: false,
            total: vendas.length,
            vendas
        });
    } catch (erro) {
        console.error("Erro ao buscar vendas:", erro);
        return res.status(500).json({
            error: true,
            mensagem: "Erro ao listar vendas",
            detalhes: erro.message
        });
    }
});



export default router;
