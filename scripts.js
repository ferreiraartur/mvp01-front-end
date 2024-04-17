/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const locale = 'pt-br'
const getList = async () => {
  let url = 'http://127.0.0.1:5000/pagamentos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.pagamentos.forEach(item => insertList(item.id, item.nome, item.descricao, (new Date (item.data_vencimento).toLocaleDateString(locale)), (new Date (item.data_pagamento).toLocaleDateString(locale)), item.valor, item.valor_multa, item.status))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função contar pagamentos em aberto do mês corrente via requisição GET
  --------------------------------------------------------------------------------------
*/


const getCount = async () => {
  let url = 'http://127.0.0.1:5000/pagamentos';
  var totalAberto;
  totalAberto=0;
  var totalPgAno;
  totalPgAno = 0;
  var totalPgMes;
  totalPgMes = 0;

  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((countPag) => {
      
      for (var index = 0; index < countPag.pagamentos.length; ++index) {
        if (countPag.pagamentos[index].status === "Aberto"){
          totalAberto += 1;
        }
      }
      document.getElementById("totalAberto").innerHTML = totalAberto;
      
      // Total pago ano
      const y = new Date();
      let year = y.getFullYear();
      for (var index = 0; index < countPag.pagamentos.length; ++index){
        if (countPag.pagamentos[index].status === "Quitado" &&  new Date (countPag.pagamentos[index].data_pagamento).getFullYear() === year){
           
          totalPgAno += countPag.pagamentos[index].valor;
        }
      }
     
      document.getElementById("totalPgAno").innerHTML = totalPgAno;

      // Total pago mês
      const d = new Date();
      let month = d.getMonth();
      for (var index = 0; index < countPag.pagamentos.length; ++index){
        if (countPag.pagamentos[index].status === "Quitado" &&  new Date (countPag.pagamentos[index].data_pagamento).getMonth() === month){
          totalPgMes += countPag.pagamentos[index].valor;
        }
      }
      document.getElementById("totalPgMes").innerHTML = totalPgMes;
      
    })
    
    .catch((error) => {
      console.error('Error:', error);
    });
}

getCount()

/*
    --------------------------------------------------------------------------------------
    Chamada da função para carregamento inicial dos dados
    --------------------------------------------------------------------------------------
  */
 getList()

/*
    --------------------------------------------------------------------------------------
    Função para colocar um item na lista do servidor via requisição POST
    --------------------------------------------------------------------------------------
  */
    const postItem = async (inputName, inputDescription, inputDueDate,inputPaymentDate,inputAmount,inputFine) => {
      const formData = new FormData();
      formData.append('nome', inputName);
      formData.append('descricao', inputDescription);
      formData.append('data_vencimento', inputDueDate);
      formData.append('data_pagamento', inputPaymentDate);
      formData.append('valor',inputAmount);
      formData.append('valor_multa',inputFine)

    
      let url = 'http://127.0.0.1:5000/pagamento';
      fetch(url, {
        method: 'post',
        body: formData
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error('Error:', error);
        });
    }

/*
    --------------------------------------------------------------------------------------
    Função para remover um item na lista do servidor via requisição POST
    --------------------------------------------------------------------------------------
  */
    const removeItem = async (idItem) => {
      let url = 'http://127.0.0.1:5000/pagamento?id=' + idItem;
      fetch(url, {
        method: 'delete'
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error('Error:', error);
        });
    }

/*
---------------------------------------------------------------------------------------
Função para quitar o pagamento
---------------------------------------------------------------------------------------
  */
    const quitarItem = async (idItem) => {
      let url = 'http://127.0.0.1:5000/atualizar_status_pagamento?id=' + idItem;
      fetch(url, {
        method: 'post'
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error('Error:', error);
        });
    }


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);

}

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão para quitar o pagamento da lista
  --------------------------------------------------------------------------------------
*/
const insertButton2 = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u2714");
  span.className = "quitar";
  span.appendChild(txt);
  parent.appendChild(span);
}


const insertButton3 = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u231B");
  span.className = "quitar";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const idItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        removeItem(idItem)
        alert("Removido!")
      }
    }
  }
}

const quitarPagamento = () => {

  let quitar = document.getElementsByClassName("quitar");
  
  let i;
  for (i = 0; i < quitar.length; i++) {
    quitar[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const idItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza que deseja quitar esse pagamento?")) {
        quitarItem(idItem)
        alert("Quitado!")
        location.reload();
      }
    }
  }
}


/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputName = document.getElementById("newInput").value;
  let inputDescription = document.getElementById("newDescription").value;
  let inputDueDate = document.getElementById("newDueDate").value;
  let inputPaymentDate = document.getElementById("newPaymentDate").value;
  let inputAmount = document.getElementById("newAmount").value;
  let inputFine = document.getElementById("newFine").value;

  if (inputName === '') {
    alert("Escreva o nome de um pagamento!");
  } else if (isNaN(inputAmount) || isNaN(inputFine)) {
    alert("Valor e multa precisam ser números!");
  } else if (inputDescription === ''){
    alert("Escreva a descrição!");
  } else if (inputDueDate === ''){
    alert("Informe a data de vencimento!");
  } else if (inputPaymentDate === ''){
    alert("Informe a data de pagamento!");
  } else if (inputAmount === ''){
    alert("Informe o valor!");
  } else if (inputFine === ''){
    alert("Informe o valor da multa!");
  } else {
    postItem(inputName, inputDescription, inputDueDate,inputPaymentDate,inputAmount,inputFine)
    alert("Item adicionado!")
    
  }
}

/*
  ------------------------------------------------------------------------------------------
  Função para buscar um pagamento por nome
  ------------------------------------------------------------------------------------------
*/
const findItem = async () => {
  let inputName2 = document.getElementById("findName").value;

  if (inputName2 === '') {
    alert ("Escreva o nome do pagamento para buscar");
  }else  {

    findItemByname(inputName2);
  }
}
/*
  --------------------------------------------------------------------------------------------
  Função para buscar no servidor
  --------------------------------------------------------------------------------------------
*/
const findItemByname = async (inputName2) => {
    
    let url = 'http://127.0.0.1:5000/pagamento?nome=' + inputName2;
    
    fetch(url, {
      method: 'get'
    })
    .then((response) => response.json())
    .then((data) => {
      if (!data.id){
        alert ("Não encontrado!")
      }else {
      clearTable();
      insertList(data.id, data.nome, data.descricao, data.data_vencimento, data.data_pagamento, data.valor, data.valor_multa, data.status)
    }
    })
    
    .catch((error) => {
      console.error('Error:', error);
    });
    

  }

const clearTable = () =>{
  var fields = document.querySelectorAll("#myTable td");

    fields.forEach(cell => {
      cell.innerHTML = "";
    });

    fields.forEach(row => {
      row.remove();
   });

  }


  /*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (id, nome, descricao, data_vencimento, data_pagamento, valor, valor_multa, status) => {
  var item = [id, nome, descricao, data_vencimento, data_pagamento, valor, valor_multa, status]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }

  insertButton(row.insertCell(-1))

  if (item[7] === "Aberto"){
    insertButton3(row.insertCell(-1))
  }else {
    insertButton2(row.insertCell(-1))
  }

  document.getElementById("newInput").value = "";
  document.getElementById("newDescription").value = "";
  document.getElementById("newDueDate").value = "";
  document.getElementById("newPaymentDate").value = "";
  document.getElementById("newAmount").value = "";
  document.getElementById("newFine").value = "";
  document.getElementById("newStatus").value = "";
  
  

  removeElement()
  quitarPagamento()
}

