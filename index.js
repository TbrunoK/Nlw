// Definimos um objeto "meta" com duas propriedades: "value", que descreve a meta como "ler um livro por mês",
// e "checked", que indica se a meta já foi concluída (true significa que está concluída).

let meta = {
  value: "ler um livro por mês",
  checked: true,
}

// Criamos um array "metas" que contém o objeto "meta" e um novo objeto meta adicional
// A segunda meta é "Caminhar 20 minutos todos os dias" e, inicialmente, não foi concluída (checked: false).

let metas = [
  meta,
  {
    value: "Caminhar 20 minutos todos os dias",
    checked: false,
  },
]

// Exibimos no console o valor da segunda meta (índice 1) que é "Caminhar 20 minutos todos os dias".
console.log(metas[1].value)
