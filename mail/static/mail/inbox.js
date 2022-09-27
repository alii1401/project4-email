// document.addEventListener('DOMContentLoaded', function() {
//   console.log('hello')

//   // Use buttons to toggle between views
//   document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
//   document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
//   document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
//   // document.querySelector('#compose').addEventListener('click', compose_email);
//   document.querySelector('#compose').onclick = compose_email

//   // By default, load the inbox
//   load_mailbox('inbox');
// });

// function compose_email() {
//   console.log('hello')

//   // Show compose view and hide other views
//   document.querySelector('#emails-view').style.display = 'none';
//   document.querySelector('#compose-view').style.display = 'block';

//   const submit = document.querySelector('#submit')
//   document.querySelector('#compose-form').onsubmit = function(e) {
//     e.preventDefault();
//     console.log(document.querySelector('#compose-recipients').value)

//     fetch('/emails',{
//       method:'POST',
//       body: JSON.stringify({
//         recipients: document.querySelector('#compose-recipients').value,
//         subject:    document.querySelector('#compose-subject').value,
//         body:       document.querySelector('#compose-body').value,
//       })
//     })
//     .then(response => response.json())
//     .then(result => {
//       console.log(result);
//     });
//   }
    
    
//   // Clear out composition fields
//   document.querySelector('#compose-recipients').value = '';
//   document.querySelector('#compose-subject').value = '';
//   document.querySelector('#compose-body').value = '';
// }

// function load_mailbox(mailbox) {
  
//   // Show the mailbox and hide other views
//   document.querySelector('#emails-view').style.display = 'block';
//   document.querySelector('#compose-view').style.display = 'none';

//   // Show the mailbox name
//   document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
// //   document.querySelector('#inbox').onclick = inbox
//   document.querySelector('#sent').onclick = sent
//   document.querySelector('#archived').onclick = archive
// //   function inbox(){h
//     fetch('emails/inbox')
//     .then(response => response.json())
//     .then(emails =>{
//       console.log(emails)
//     });
// //   }
//   function sent(){
//     fetch('emails/sent')
//     .then(response => response.json())
//     .then(emails =>{
//       console.log(emails)
//     });
//   }
//   function archive(){
//     fetch('emails/archive')
//     .then(response => response.json())
//     .then(emails =>{
//       console.log(emails)
//     });
//   }
  
// }
document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').onclick = compose_email

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  console.log('hello') 

  // Show compose view and hide other views
  document.querySelectorAll('div').forEach((div) => {
    div.style.display = 'block'
  })
  document.querySelector('#emails-view').style.display = 'none';

  const submit = document.querySelector('#submit')
  document.querySelector('#compose-form').onsubmit = function(e) {
    e.preventDefault();
    console.log(document.querySelector('#compose-recipients').value)

    fetch('/emails',{
      method:'POST',
      body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject:    document.querySelector('#compose-subject').value,
        body:       document.querySelector('#compose-body').value,
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);

    });
    location.reload();
    load_mailbox('sent');
  } 
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

}

function load_mailbox(mailbox) { 
  console.log(mailbox)
  // Show the mailbox and hide other views
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-view').style.display  = 'block';

  if (mailbox == "inbox"){
    inbox()
  }
  if (mailbox == "sent"){
    sent()
  }
  if (mailbox == "archive"){
    archive()
  }

  function showPage(id){
    console.log("show")
    fetch(`emails/${id}`)
    .then(response => response.json())
    .then(email => {
        if(email.id == id){
        document.querySelector('#emails-view').innerHTML = email.body;
        }
    })
  }
  function showEmailInbox(id){
    fetch('emails/inbox')
    .then(response => response.json())
    .then(emails => {
      emails.forEach(email => {
        if ( email.id == id){
          document.querySelector('#emails-view').innerHTML = `
          <b><h6>From:</h6></b>${email.sender}
          <b><h6>To:</h6></b>${email.recipients}
          <b><h6>Subject:</h6></b>${email.subject}
          <b><h6>Timestamp:</h6></b>${email.timestamp}
          <div><button class="btn btn-sm btn-outline-success" id="reply">Reply</button>
          <button class="btn btn-sm btn-outline-warning" id="archive">Archived</button></div><hr>
          ${email.body}`
        }
        document.addEventListener("click",event => {
          const element = event.target;
    
          if(element.id == 'reply' && email.id == id){
            document.querySelectorAll('div').forEach(div => {
              div.style.display = 'block';
            })
            document.querySelector('#emails-view').style.display = 'none'
            document.querySelector('#compose-recipients').value = '';
            document.querySelector('#compose-subject').value = '';
            document.querySelector('#compose-body').value = '';

            document.querySelector('#compose-recipients').value = `${email.sender}`;
            document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
            x = document.getElementById('compose-body');
            x.value = `On ${email.timestamp} ${email.sender} wrote: `;

            const submit = document.querySelector('#submit')
            document.querySelector('#compose-form').onsubmit = function(e) {
              e.preventDefault();

              fetch('/emails',{
                method:'POST',
                body: JSON.stringify({
                  recipients: document.querySelector('#compose-recipients').value,
                  subject:    document.querySelector('#compose-subject').value,
                  body:       document.querySelector('#compose-body').value,
                })
              })
              .then(response => response.json())
              .then(result => {
                console.log(result);

              });
              location.reload();
              load_mailbox('sent');
        }     
          }
          if(element.id == 'archive' && email.id == id){
            button = document.querySelector('#archive');
            if(button.innerHTML == 'Archived'){
              fetch(`emails/${email.id}`,{
                method:'PUT',
                body:JSON.stringify({
                  archived:true
                })
              })
              button.innerHTML = `Unarchived`;
              location.reload();
            }
          }
      })
      })
    })
  }
  function showEmailArchived(id){
    
    fetch(`emails/${id}`)
    .then(response => response.json())
    .then(email => {
      document.querySelector('#emails-view').innerHTML = `
          <b><h6>From:</h6></b>${email.sender}
          <b><h6>To:</h6></b>${email.recipients}
          <b><h6>Subject:</h6></b>${email.subject}
          <b><h6>Timestamp:</h6></b>${email.timestamp}
          <button class="btn btn-sm btn-outline-warning "  id='unarchive'>Unarchived</button></div><hr>
          ${email.body}`

      document.addEventListener("click",event => {
        const element = event.target;
        if(element.id == 'unarchive'){
            button = document.querySelector('#unarchive');
            if(button.innerHTML == 'Unarchived'){
              fetch(`emails/${email.id}`,{
                method:'PUT',
                body:JSON.stringify({
                  archived:false
                })
              })
              button.innerHTML = `Archived`;
            }else{
              fetch(`emails/${email.id}`,{
                method:'PUT',
                body:JSON.stringify({
                  archived:true
                })
              })
              button.innerHTML = `Unarchived`;
            }
          
        }
      })
  })
  }

  function inbox(){
  mailbox = `Inbox`;
  var flag = 0 ;
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch('emails/inbox')
  .then(response => response.json())
  .then(emails =>{
  console.log(emails)
  document.querySelectorAll('div').forEach((div) => {
    div.style.display = 'none'
  })
  document.querySelector('#container').style.display  = 'block';
  document.querySelector('#emails-view').style.display  = 'block';
  
  if (flag != 1){

      emails.forEach(email => {
      var div = document.createElement('div');
      if(email.read == true){
        
        div = `<div id="div" style=margin-bottom:5px;border-radius:5px;><button id='${email.id}' class="btn btn-outline-dark">
          ${email.sender}     |      ${email.subject}      |  ${email.timestamp} </button></div>`;
      }else{
        div = `<div id="div" style=margin-bottom:5px;><button class="btn btn-outline-info" id='${email.id}'>${email.sender} | ${email.subject} | ${email.timestamp} </button></div>`;
      }
      document.querySelector('#emails-view').innerHTML += div
      flag = 1;
      document.addEventListener("click",event =>{
          const element = event.target;
          console.log(element)
          console.log(element.id)
          if(element.id == email.id){
            fetch(`emails/${email.id}`,{
              method:'PUT',
              body:JSON.stringify({
                read:true
              })
            })
            let id = 0
            id = email.id
            showEmailInbox(id);
            
          }
        })
      })
    
  }
});
}

function sent() {
  box = "Sent"
  document.querySelector('#emails-view').innerHTML = `<h3>${box.charAt(0).toUpperCase() + box.slice(1)}</h3>`;
    fetch('emails/sent')
    .then(response => response.json())
    .then(emails => {
      document.querySelectorAll('div').forEach((div) => {
    div.style.display = 'none'
  })
  document.querySelector('#container').style.display  = 'block';
  document.querySelector('#emails-view').style.display  = 'block';
      emails.forEach(email =>{
        var div = document.createElement('div');
div = `<div style=margin-bottom:5px; ><button class="btn btn-outline-info" id='${email.id}'> ${email.recipients} | ${email.subject} | ${email.timestamp}</button></div>`;
        document.querySelector('#emails-view').innerHTML += div

          document.addEventListener("click",event =>{
            const element = event.target;
            if(element.id == email.id){
              let id = 0
              id = email.id
              showPage(id);
              
            }
          })
      })
    })
  }
function archive() {
  box = "Archived"
  document.querySelector('#emails-view').innerHTML = `<h3>${box.charAt(0).toUpperCase() + box.slice(1)}</h3>`;

  fetch('emails/archive')
  .then(response => response.json())
  .then(emails => {
    document.querySelectorAll('div').forEach((div) => {
    div.style.display = 'none'
  })
  document.querySelector('#container').style.display  = 'block';
  document.querySelector('#emails-view').style.display  = 'block';
    emails.forEach(email =>{
      console.log(email)
      var div = document.createElement('div');
      div = `<div style=margin-bottom:5px;><button class="btn btn-outline-info" id='${email.id}'>${email.sender} | ${email.subject} | ${email.timestamp} </button></div>`;
      document.querySelector('#emails-view').innerHTML += div

      document.addEventListener("click",event =>{
        const element = event.target;
    if(element.id == email.id){
      let id = 0
      id = email.id
      showEmailArchived(id);
      
    }
  })
})

})

}
}
    