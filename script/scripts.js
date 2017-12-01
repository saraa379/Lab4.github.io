window.addEventListener('load', function(event) {

	var fails = 0;
	var failMeddelande;
	var btnKey = document.getElementById('btnKey');
	var pFails = document.getElementById('pFails');
	var pKey = document.getElementById('pKey');
	var hKey = document.getElementById('hKey');
	var key; //key for using API


	let promiseKey = new Promise(function(succeed,fail){

		btnKey.addEventListener('click', function(event){
			
			var url = 'https://www.forverkliga.se/JavaScript/api/crud.php?requestKey';
			var ajax = new XMLHttpRequest();
			ajax.open('get', url);
			ajax.onreadystatechange = function() {
				console.log('onreadystatechange',ajax.status, ajax.readyState);
				//output.innerHTML += `readystatechange har inträffat! readyState=${ajax.readyState}, status=${ajax.status} <br />`;
				if( ajax.readyState === 4 && ajax.status === 200 ) {
					succeed(ajax.responseText);
				}
				else if(ajax.status != 200){
					console.log('status: ' + ajax.status + 'readyState: ' + ajax.readyState);
					fail('Attempt to retrieve a key was unsuccessful');
				}
			}
			ajax.send();
		}); //end of btnKey.eventListener
	});//end of promise

		promiseKey.then((responseText)=>{
			var jsonObject = JSON.parse(responseText);
			console.log(jsonObject);
			pKey.innerText += jsonObject.key;
			key = jsonObject.key;
			pKey.style.display = 'block';
			hKey.style.display = 'none';
			btnKey.style.marginTop = '20px';
		}, (failed)=>{
			console.log('failed');
			fails = fails + 1;
			pFails.innerText = 'Number of requests that failed: ' + fails;
			pKey.innerText = 'Please try again.'
		});

	//Toggling bookResult, funkar inte
	var viewTitle = document.getElementById('viewTitle');
	var booksResult = document.getElementById('booksResult');

	viewTitle.addEventListener('click', function(event){
		if(booksResult.style.display === 'none'){
			console.log(booksResult.style.display);
			booksResult.style.display === 'block';
		} else {
			booksResult.style.display === 'none';
		}
			
	}); //end of viewTitle.eventListener

	//View books functionality
	var btnView = document.getElementById('btnView');
	var booksResult = document.getElementById('booksResult');
	var errorMessage;
	var errorM = document.getElementById('errorM');

	btnView.addEventListener('click', function(event){
		var url = 'https://www.forverkliga.se/JavaScript/api/crud.php?op=select&key=' + key;
		
		fetch(url)
  			.then((resp) => resp.json())
  			.then(function(data) {
    			console.log(data);
    			console.log(data.status);
    			if (data.status === 'success'){
    				if (data.data.length === 0) {
    					fails = fails + 1;
						pFails.innerText = 'Number of requests that failed: ' + fails;
						errorM.style.display = 'block';
						errorM.innerText = 'Currently, there are no book in the database. Please add a book';

    				} 
    				else {
    					//Here comes books
    					var booksArray = data.data;
    					for (var i = 0; i < booksArray.length; i++) {
    						console.log(booksArray[i]);
    						var books = document.createElement('p');
    						var bookString = 'Id: ' + booksArray[i].id + ', ' + booksArray[i].title + ', ' + booksArray[i].author;
    						console.log(bookString);
    						var textNode = document.createTextNode(bookString);
    						books.appendChild(textNode);
    						booksResult.appendChild(books);

    					}
    				}

    			} else if (data.status === 'error'){
    				console.log(data.message);
    				errorMessage = data.message;
    				fails = fails + 1;
					pFails.innerText = 'Number of requests that failed: ' + fails;
					errorM.style.display = 'block';
					errorM.innerText = 'Your request failed. The reason: ' + errorMessage;

    			}
  		})
  		.catch(function(error) {
    		console.log(error);
    		fails = fails + 1;
			pFails.innerText = 'Number of requests that failed: ' + fails;
			errorM.style.display = 'block';
			errorM.innerText = error;

  		});   

	});//end of btnView



	//Add book functionality
	var btnAdd = document.getElementById('btnAdd');
	var errorAddBook = document.getElementById('errorAddBook');
	var addedBooks = document.getElementById('addedBooks');
	var titleAddedBooks = document.getElementById('titleAddedBooks');

	btnAdd.addEventListener('click', function(event){
		var bookTitle = document.getElementById('inputBookTitle').value;
		document.getElementById('inputBookTitle').value = "";
		var bookAuthor = document.getElementById('inputBookAuthor').value;
		document.getElementById('inputBookAuthor').value = "";
		if (bookTitle.length === 0||bookAuthor.length===0) {
			errorMessage = 'Please enter name of a book and author';
    		fails = fails + 1;
			pFails.innerText = 'Number of requests that failed: ' + fails;
			errorAddBook.style.display = 'block';
			errorAddBook.innerText = errorMessage;
		} else {
		var url = 'https://www.forverkliga.se/JavaScript/api/crud.php?op=insert&key=' + key + '&title=' + bookTitle + '&author=' + bookAuthor;
		console.log(url);

		fetch(url)
  			.then((resp) => resp.json())
  			.then(function(data) {
    			console.log(data);
    			console.log(data.status);
    			if (data.status === 'success'){
    				console.log(data.id);
    				var addedBook = document.createElement('p');
    				var bookString = 'Id: ' + data.id + ', ' + bookTitle + ', ' + bookAuthor;
    				console.log(bookString);
    				titleAddedBooks.style.display = 'block';
    				var textNode = document.createTextNode(bookString);
    				addedBook.appendChild(textNode);
    				addedBooks.appendChild(addedBook);

    			} else if (data.status === 'error'){
    				console.log(data.message);
    				errorMessage = data.message;
    				fails = fails + 1;
					pFails.innerText = 'Number of requests that failed: ' + fails;
					errorAddBook.style.display = 'block';
					errorAddBook.innerText = 'Your request failed. The reason: ' + errorMessage;

    			}
  		})
  		.catch(function(error) {
    		console.log(error);
    		fails = fails + 1;
			pFails.innerText = 'Number of requests that failed: ' + fails;
			errorAddBook.style.display = 'block';
			errorAddBook.innerText = error;

  		});  //end of fetch

  		} //end of else
	}); //end of btnAdd.eventListener

	/*
	
	btnView.addEventListener('click', function(event){
		var url = 'https://www.forverkliga.se/JavaScript/api/crud.php?op=select&key=' + key;
		fetch(url).then(function(response) {
		
	  		if(response.status === 'success') {
	  			console.log(response.status);
	    		return response.data.json();
		  	}
	  		throw new Error(response.message);
		}).then(function(json) { 
			console.log(json); 
		}).catch(function(error) {
	  		console.log(error);
		}); //end of fetch
	});//end of btnView eventListener*/
	


}); //windows.load


	

