// Importa as funções 'select', 'input' e 'checkbox' da biblioteca '@inquirer/prompts'
const { select, input, checkbox } = require("@inquirer/prompts")

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
    console.log("A meta não pode ser vazia.")
    return cadastrarMeta() // Chama a função novamente caso esteja vazia
  }

  // Adiciona a nova meta à lista de metas
  metas.push({ value: meta, checked: false })
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

  // Verifica se nenhuma meta foi selecionada
  if (respostas.length == 0) {
    console.log("Nenhuma meta Selecionada!")
    return // Sai da função se não houver seleção
  }
  // Desmarca cada metas
  metas.forEach((m) => {
    m.checked = false
  })

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
  console.log("Meta(s) marcadas como  concluída(s)")
}

const metasRealizadas = async () => {
  const realizadas = metas.filter((meta) => {
    return meta.checked
  })

  if (realizadas.length == 0) {
    console.log("Não existem metas realizadas! :/")
    return
  }

  await select({
    message: "Metas Realizadas",
    choices: [...realizadas],
  })
}

// Função principal que controla o menu
const start = async () => {
  // Loop que mantém o menu ativo
  while (true) {
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
        console.log(metas) // Exibe as metas após o cadastro
        break
      case "listar":
        // Chama a função de listagem de metas
        await listarMetas()
        console.log("Vamos listar")
        break
      case "realizadas":
        await metasRealizadas()
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
