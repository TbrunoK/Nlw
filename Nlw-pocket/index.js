// Importa as funções 'select', 'input' e 'checkbox' da biblioteca '@inquirer/prompts'
const { select, input, checkbox } = require("@inquirer/prompts")
const fs = require("fs").promises

// Mensagem de boas vindas :)
let mensagem = "Bem vindo ao app de metas"

// Lista de metas
let metas

// Função para carregar as metas do arquivo
const carregarMetas = async () => {
  try {
    const dados = await fs.readFile("metas.json", "utf-8")
    metas = JSON.parse(dados)
  } catch (error) {
    metas = [] // Inicializa vazio se não existir o arquivo
  }
}

// Função para salvar as metas no arquivo
const salvarMetas = async () => {
  await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

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
  mensagem = "Meta cadastrada com sucesso!"
  await salvarMetas() // Salva a meta após o cadastro
}

// Função assíncrona para listar e marcar metas
const listarMetas = async () => {
  // Verifica se há metas disponíveis
  if (metas.length === 0) {
    mensagem = "Não há metas para listar!"
    return
  }

  // Apresenta as metas ao usuário com a opção de selecionar
  const respostas = await checkbox({
    message:
      "Use as setas para mudar de meta, o espaço para marcar e desmarcar e o enter para finalizar essa etapa",
    choices: [...metas], // As metas são passadas como opções
    instructions: false, // Não mostrar instruções adicionais
  })

  // Desmarca todas as metas
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
  mensagem = "Meta(s) marcadas como concluída(s)"
  await salvarMetas() // Salva as mudanças
}
const metasRealizadas = async () => {
  const realizadas = metas.filter((meta) => meta.checked)

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
  const abertas = metas.filter((meta) => !meta.checked)

  if (abertas.length == 0) {
    mensagem = "Não existem metas em aberto! :)"
    return
  }

  await select({
    message: "Metas Abertas: " + abertas.length,
    choices: [...abertas],
  })
}

const deletarMetas = async () => {
  if (metas.length === 0) {
    mensagem = "Não há metas para deletar!"
    return
  }

  const metasDesmarcadas = metas.map((meta) => ({
    value: meta.value,
    checked: false,
  }))

  const itensADeletar = await checkbox({
    message: "Selecionar itens para deletar",
    choices: metasDesmarcadas,
    instructions: false,
  })

  if (itensADeletar.length == 0) {
    mensagem = "Nenhum item selecionado para deletar!"
    return
  }

  metas = metas.filter((meta) => !itensADeletar.includes(meta.value))

  mensagem = "Meta(s) deletada(s) com sucesso!"
  await salvarMetas()
}

// Função para exibir mensagens
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
  await carregarMetas()

  // Loop que mantém o menu ativo
  while (true) {
    mostrarMensagem()

    // Apresenta o menu ao usuário e captura a escolha
    const opcao = await select({
      message: "Menu >", // Mensagem exibida no menu
      choices: [
        { name: "Cadastrar metas", value: "cadastrar" },
        { name: "Listar Metas", value: "listar" },
        { name: "Metas realizadas", value: "realizadas" },
        { name: "Metas abertas", value: "abertas" },
        { name: "Deletar metas", value: "deletar" },
        { name: "Sair", value: "sair" },
      ],
    })

    // Verifica qual opção foi selecionada
    switch (opcao) {
      case "cadastrar":
        await cadastrarMeta()
        break
      case "listar":
        await listarMetas()
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
        console.log("Até a próxima!")
        return // Sai da função, encerrando o programa
    }
  }
}

// Inicia o programa chamando a função start
start()
