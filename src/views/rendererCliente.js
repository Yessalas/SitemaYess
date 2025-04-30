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


let arrayClient =[]


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
// captura do id do cliente(usado no delete e update)
let id = document.getElementById('idClient')
//

function teclaEnter(event){
    if (event.key === "Enter") {
        event.preventDefault()
        buscarCliente()
    }
}

function restaurarEnter(){
    frmClient.removeEventListener('keydown', teclaEnter)
}

frmClient.addEventListener('keydown', teclaEnter)

// Evento associado ao botão submit (Uso das validações do HTML)
frmClient.addEventListener('submit', async (event)=>{
    // Evitar o comportamento padrão do submit que é enviar os dados do formulário e reiniciar o documento HTML
    event.preventDefault()

    // Teste importante (Recebimento dos dados do formulário - Passo 1 do fluxo)
    console.log(nameClient.value, cpfClient.value, emailClient.value, phoneClient.value, 
        cepClient.value, addressClient.value, numberClient.value, numberClient.value, 
        complementClient.value, neighborhoodClient.value, cityClient.value, ufClient.value)

    // estrategia para reutilizar o submit para criar um novo usuario ou alterar  os dados de um usuario
    if (id.value === ""){
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
    }else{
        
    }

    // criar um objeto para armazenar os dados do cliente antes de enviar ao main
    
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





// let arrayClient =[]



function buscarCliente(){
    let name=document.getElementById('searchClient').value
    console.log(name)

    if(name ===""){
        //enviar um alerta para o usuario
        api.validateSearch()
        foco.focus()
    } else {
    api.searchName(name)

    api.renderClient((event,dataClient)=>{
        console.log(dataClient)

        const dadosCliente = JSON.parse(dataClient)
        arrayClient= dadosCliente
        arrayClient.forEach((c) => {
            id.value=c._id,
            nameClient.value = c.nomeCliente,
            cpfClient.value = c.cpfCliente,
            emailClient.value=c.emailCliente, 
            phoneClient.value=c.foneCliente, 
            cepClient.value=c.cepCliente, 
            addressClient.value=c.logradouroCliente, 
            numberClient.value=c.numeroCliente,  
            complementClient.value=c.complementoCliente, 
            neighborhoodClient.value=c.bairroCliente, 
            cityClient.value=c.cidadeCliente, 
            ufClient.value=c.ufcCliente

            // bloqueio do botão adicionar
            btnCreate.disabled = true
            // desbloqueio dos botões
            btnUpdate.disabled = false
            btnDelete.disabled = false
        });
    });
};
}

api.setClient((args)=>{
    let campoBusca = document.getElementById('searchClient').value
    nameClient.focus()
    foco.value =""
    nameClient.value = campoBusca
})


function excluirCliente(){
    console.log(id.value)
    api.deleteClient(id)
}