// const { cp } = require("node:original-fs")

// Buscar CEP
function buscarCEP() {
    //console.log("teste do evento blur")
    //armazenar o cep digitado na variável
    let cep = document.getElementById('inputCEPClient').value
    //console.log(cep) //teste de recebimento do CEP
    //"consumir" a API do ViaCEP
    let urlAPI = `https://viacep.com.br/ws/${cep}/json/`
    //acessando o web service par abter os dados
    fetch(urlAPI)
        .then(response => response.json())
        .then(dados => {
            //extração dos dados
            document.getElementById('inputAddressClient').value = dados.logradouro
            document.getElementById('inputNeighborhoodClient').value = dados.bairro
            document.getElementById('inputCityClient').value = dados.localidade
            document.getElementById('inputUFClient').value = dados.uf
        })
        .catch(error => console.log(error))
}

//capturar o foco na busca pelo nome do cliente
// a constatnte foco obtem o elemento html(inpu) identificado como 'searchClient'
const foco = document.getElementById('searchClient')
// iniciar a janel de cliente alterando as propriedades de alguns elementos
document.addEventListener('DOMContentLoaded',() => {
    // desativar os botões
    btnUpdate.disabled= true
    btnDelete.disabled= true
    foco.focus()
})

// Captura dos dados dos input do funcionario (Passo 1: fluxo)
let frmClient=document.getElementById('frmClient')
let nameClient=document.getElementById('inputNameClient')
let cpfClient=document.getElementById('inputCPFClient')
let emailClient=document.getElementById('inputEmailClient')
let phoneClient=document.getElementById('inputPhoneClient')
let cepClient=document.getElementById('inputCEPClient')
let addressClient=document.getElementById('inputAddressClient')
let numberClient=document.getElementById('inputNumberClient')
let complementClient=document.getElementById('inputComplementClient')
let neighborhoodClient=document.getElementById('inputNeighborhoodClient')
let cityClient=document.getElementById('inputCityClient')
let ufClient=document.getElementById('inputUFClient')

// 
// Evento associado ao botão submit (Uso das validações do HTML)
frmClient.addEventListener('submit', async (event)=>{
    // Evitar o comportamento padrão do submit que é enviar os dados do formulário e reiniciar o documento HTML
    event.preventDefault()

    // Teste importante (Recebimento dos dados do formulário - Passo 1 do fluxo)
    console.log(nameClient.value, cpfClient.value, emailClient.value, phoneClient.value, 
        cepClient.value, addressClient.value, numberClient.value, numberClient.value, 
        complementClient.value, neighborhoodClient.value, cityClient.value, ufClient.value)
    // criar um objeto para armazenar os dados do cliente antes de enviar ao main
    const client = {
        nameClient : nameClient.value,
        cpfClient: cpfClient.value,
        emailClient: emailClient.value,
        phoneClient: phoneClient.value, 
        cepClient:cepClient.value, 
        addressClient: addressClient.value, 
        numberClient:numberClient.value, 
        complementClient:complementClient.value,
        neighborhoodClient: neighborhoodClient.value, 
        cityClient: cityClient.value,
        ufClient:ufClient.value
    }
    // enviar ao main o objeto client - passo 2 fluxo
    api.newClient(client)
})
/// =================== RESET FORM ==============================================================
function resetForm(){
    // limpar os campos e resetar o formulario com as configurações pré definidas
    location.reload()
}
// recebimento  
api.resetForm((args)=>{
    resetForm()
})
/// =================================================================================
