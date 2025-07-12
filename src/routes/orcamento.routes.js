import express from 'express';
import Orcamento from '../models/Orcamento.js';

const router = express.Router();

// rota de cadatrar orçamento
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
            dataHora
        } = req.body;

        // Se quiser gerar as parcelas aqui (igual na venda), pode fazer:
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

        const novoOrcamento = new Orcamento({
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
            status: 'aguardando', // <- sempre status de orçamento
            dataHora: dataHora || new Date(),
        });

        const salvo = await novoOrcamento.save();

        return res.status(201).json({
            error: false,
            mensagem: "Orçamento criado com sucesso!",
            orcamento: salvo,
        });
    } catch (erro) {
        console.error("Erro ao criar orçamento:", erro);
        return res.status(500).json({
            error: true,
            mensagem: "Erro ao criar orçamento.",
            detalhes: erro.message,
        });
    }
});

// GET /orcamento - Lista todos os orçamentos
router.get("/", async (req, res) => {
  try {
    const orcamentos = await Orcamento.find()
      .populate("clienteId", "nome email")
      .populate("usuarioId", "nome");

    return res.status(200).json({
      error: false,
      orcamentos,
    });
  } catch (erro) {
    console.error("Erro ao buscar orçamentos:", erro);
    return res.status(500).json({
      error: true,
      mensagem: "Erro ao buscar orçamentos.",
      detalhes: erro.message,
    });
  }
});

//Obter um orçamento por ID (GET /orcamento/:id)
router.get("/:id", async (req, res) => {
  try {
    const orcamento = await Orcamento.findById(req.params.id)
      .populate("clienteId", "nome email")
      .populate("usuarioId", "nome");

    if (!orcamento) {
      return res.status(404).json({
        error: true,
        mensagem: "Orçamento não encontrado.",
      });
    }

    return res.status(200).json({ error: false, orcamento });
  } catch (erro) {
    return res.status(500).json({
      error: true,
      mensagem: "Erro ao buscar orçamento.",
      detalhes: erro.message,
    });
  }
});

//Atualizar um orçamento (PUT /orcamento/:id)
router.put("/:id", async (req, res) => {
  try {
    const atualizado = await Orcamento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!atualizado) {
      return res.status(404).json({
        error: true,
        mensagem: "Orçamento não encontrado.",
      });
    }

    return res.status(200).json({
      error: false,
      mensagem: "Orçamento atualizado com sucesso.",
      orcamento: atualizado,
    });
  } catch (erro) {
    return res.status(500).json({
      error: true,
      mensagem: "Erro ao atualizar orçamento.",
      detalhes: erro.message,
    });
  }
});

//Excluir um orçamento
router.delete("/:id", async (req, res) => {
  try {
    const removido = await Orcamento.findByIdAndDelete(req.params.id);

    if (!removido) {
      return res.status(404).json({
        error: true,
        mensagem: "Orçamento não encontrado.",
      });
    }

    return res.status(200).json({
      error: false,
      mensagem: "Orçamento excluído com sucesso.",
    });
  } catch (erro) {
    return res.status(500).json({
      error: true,
      mensagem: "Erro ao excluir orçamento.",
      detalhes: erro.message,
    });
  }
});


//Transformar um orçamento em uma venda
router.post("/:id/transformar", async (req, res) => {
  try {
    const orcamento = await Orcamento.findById(req.params.id);

    if (!orcamento) {
      return res.status(404).json({
        error: true,
        mensagem: "Orçamento não encontrado.",
      });
    }

    // Cria nova venda com base no orçamento
    const novaVenda = new Venda({
      ...orcamento.toObject(),
      status: orcamento.formaPagamento === "cred-loja" ? "pendente" : "finalizada",
      _id: undefined, // remove o _id para não duplicar
    });

    const vendaSalva = await novaVenda.save();

    // Remove o orçamento original
    await Orcamento.findByIdAndDelete(req.params.id);

    return res.status(201).json({
      error: false,
      mensagem: "Orçamento convertido em venda com sucesso.",
      venda: vendaSalva,
    });
  } catch (erro) {
    return res.status(500).json({
      error: true,
      mensagem: "Erro ao transformar orçamento em venda.",
      detalhes: erro.message,
    });
  }
});

export default router;