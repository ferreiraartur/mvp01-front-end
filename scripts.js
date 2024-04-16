/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/pagamentos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.pagamentos.forEach(item => insertList(item.id, item.nome, item.descricao, item.data_vencimento, item.data_pagamento, item.valor, item.valor_multa, item.status))
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
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((countPag) => {
      var j;
      j=0;
     // for (var index = 0; index < countPag.pagamentos.length; ++index) {
     //   if (countPag.pagamentos[index].descricao === 'casa'){
     //     j += 1;
      //  }
      for (var index = 0; index < countPag.pagamentos.length; ++index) {
        console.log("teste",countPag.pagamentos[index].data_vencimento);
      }
      console.log ("j",j);
      //var c = countPag.pagamentos.length;
      //console.log(c);
      //data.pagamentos.forEach(item => insertList(item.id, item.nome, item.descricao, item.data_vencimento, item.data_pagamento, item.valor, item.valor_multa, item.status))
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
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const idItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        //deleteItem(nomeItem)
        removeItem(idItem)
        alert("Removido!")
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
  } else {
    postItem(inputName, inputDescription, inputDueDate,inputPaymentDate,inputAmount,inputFine)
    alert("Item adicionado!")
    //getList()
  }
}

/*
  ------------------------------------------------------------------------------------------
  Função para buscar um pagamento por nome
  ------------------------------------------------------------------------------------------
*/
const findItem = async () => {
  
  let inputName2 = document.getElementById("findName").value;
  //console.log ("testando123",inputName2);
  if (inputName2 === '') {
    alert ("Escreva o nome do pagamento para buscar");
  }else  {

    await findItemByname(inputName2);
  
  
  }
}
/*
  --------------------------------------------------------------------------------------------
  Função para buscar no servidor
  --------------------------------------------------------------------------------------------
*/
const findItemByname = async (inputName2) => {
    //console.log ("testando1234",inputName2);
    let url = 'http://127.0.0.1:5000/pagamento?nome=' + inputName2;
    //debugger
    fetch(url, {
      method: 'get'
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      clearTable();
     // insertList(data.id, data.nome, data.descricao, data.data_vencimento, data.data_pagamento, data.valor, data.valor_multa, data.status)
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    

  }

const clearTable = () =>{
  
  //var table2 = document.getElementById("myTable");
  //var tr = document.getElementsByTagName("tr");
  //for (var i=1; i< tr.length; i++) {
  //  table2.deleteRow(1);

 // }

  var fields = document.querySelectorAll("#myTable td");

    fields.forEach(cell => {
      cell.innerHTML = "";
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
  //document.getElementById("id").value = "";
  document.getElementById("newInput").value = "";
  document.getElementById("newDescription").value = "";
  document.getElementById("newDueDate").value = "";
  document.getElementById("newPaymentDate").value = "";
  document.getElementById("newAmount").value = "";
  document.getElementById("newFine").value = "";
  document.getElementById("newStatus").value = "";
  
  

  removeElement()
}


  

/* 
----------------------------------------------------------------------------------------
Formatar data
----------------------------------------------------------------------------------------
*/


//formatação de data atual com locales
//const novaData = new Date();
//console.log(novaData);// data sem formatação
//console.log(novaData.toLocaleDateString('pt-BR'));// data em português dia/mês/ano
//console.log(novaData.toLocaleDateString('ko-KR')); //coreano ano.mês.dia.


