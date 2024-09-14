// Importa as funções 'select', 'input' e 'checkbox' da biblioteca '@inquirer/prompts'
const { select, input, checkbox } = require("@inquirer/prompts")

let mensagem = "Bem vindo ao app de metas"

// Objeto que representa uma meta inicial
let meta = {
  value: "Tomar 3L de água por dia", // Descrição da meta
  checked: false, // Status da meta (concluída ou não)
}

// Lista de metas, inicialmente contendo apenas a meta acima
let metas = [meta]

// Função assíncrona para cadastrar uma nova meta
const cadastrarMeta = async () => {
  // Pede ao usuário para digitar uma nova meta
  const meta = await input({ message: "Digite a meta: " })

  // Verifica se a meta está vazia
  if (meta.length == 0) {
    mensagem = "A meta não pode ser vazia."
    return
  }

  // Adiciona a nova meta à lista de metas
  metas.push({ value: meta, checked: false })

  mensagem = "Meta Cadastrada com Sucesso!"
}

// Função assíncrona para listar e marcar metas
const listarMetas = async () => {
  // Apresenta as metas ao usuário com a opção de selecionar
  const respostas = await checkbox({
    message:
      "Use as setas para mudar de meta, o espaço para marcar e desmarcar e o enter para finalizar essa etapa",
    choices: [...metas], // As metas são passadas como opções
    instructions: false, // Não mostrar instruções adicionais
  })

  // Desmarca cada metas
  metas.forEach((m) => {
    m.checked = false
  })

  // Verifica se nenhuma meta foi selecionada
  if (respostas.length == 0) {
    mensagem = "Nenhuma meta Selecionada!"
    return // Sai da função se não houver seleção
  }

  // Itera sobre as respostas selecionadas
  respostas.forEach((resposta) => {
    // Busca a meta correspondente na lista de metas
    const meta = metas.find((m) => m.value == resposta)

    // Se a meta for encontrada, marca como concluída
    if (meta) {
      meta.checked = true
    }
  })

  // Exibe uma mensagem de conclusão
  mensagem = "Meta(s) marcadas como  concluída(s)"
}

const metasRealizadas = async () => {
  const realizadas = metas.filter((meta) => {
    return meta.checked
  })

  if (realizadas.length == 0) {
    mensagem = "Não existem metas realizadas! :/"
    return
  }

  await select({
    message: "Metas Realizadas: " + realizadas.length,
    choices: [...realizadas],
  })
}

const metasAbertas = async () => {
  const abertas = metas.filter((meta) => {
    return meta.checked != true
  })

  if (abertas.length == 0) {
    mensagem = "Não existe metas em aberto! :)"
    return
  }

  await select({
    message: "Metas Abertas: " + abertas.length,
    choices: [...abertas],
  })
}
// Função deletar metas
const deletarMetas = async () => {
  const metasDesmarcadas = metas.map((meta) => {
    return { value: meta.value, checked: false }
  })

  const itensADeletar = await checkbox({
    message: "Selecionar itens para deletar",
    choices: metasDesmarcadas,
    instructions: false,
  })

  if (itensADeletar.length == 0) {
    mensagem = "Nenhum item selecionado para deletar!"
    return
  }

  // Atualiza a lista de metas, filtrando as que não foram selecionadas para deletar
  metas = metas.filter((meta) => !itensADeletar.includes(meta.value))

  mensagem = "Meta(s) deletada(s) com sucesso!"
}

const mostrarMensagem = () => {
  console.clear()

  if (mensagem != "") {
    console.log(mensagem)
    console.log("")
    mensagem = ""
  }
}

// Função principal que controla o menu
const start = async () => {
  // Loop que mantém o menu ativo
  while (true) {
    mostrarMensagem()
    // Apresenta o menu ao usuário e captura a escolha
    const opcao = await select({
      message: "Menu >", // Mensagem exibida no menu
      choices: [
        {
          name: "Cadastrar metas", // Nome da opção no menu
          value: "cadastrar", // Valor retornado quando a opção é selecionada
        },
        {
          name: "Listar Metas", // Nome da opção no menu
          value: "listar", // Valor ajustado para 'listar' para corresponder à verificação
        },
        {
          name: "Metas realizadas", // Nome da opção no menu
          value: "realizadas", // Valor ajustado para 'listar' para corresponder à verificação
        },
        {
          name: "Metas abertas", // Nome da opção no menu
          value: "abertas", // Valor ajustado para 'listar' para corresponder à verificação
        },
        {
          name: "Deletar metas", //Nome da opção deletar
          value: "deletar", // valor ajudado para deletar as metas
        },
        {
          name: "Sair", // Nome da opção no menu
          value: "sair", // Valor retornado quando a opção é selecionada
        },
      ],
    })

    // Verifica qual opção foi selecionada
    switch (opcao) {
      case "cadastrar":
        // Chama a função de cadastro de metas
        await cadastrarMeta()
        break
      case "listar":
        // Chama a função de listagem de metas
        await listarMetas()
        console.log("Vamos listar")
        break
      case "realizadas":
        await metasRealizadas()
        break
      case "abertas":
        await metasAbertas()
        break
      case "deletar":
        await deletarMetas()
        break
      case "sair":
        // Exibe mensagem de despedida e encerra o loop
        console.log("Até a próxima!")
        return // Sai da função, encerrando o programa
    }
  }
}

// Inicia o programa chamando a função start
start()
