function newPopup(url, a) {
  popupWindow = window.open(
    url,
    "popUpWindow",
    "height=300,width=400,left=10,top=10,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes"
  );
  alert(a);
}

function creartexto(img1, title1, desc1, precio1, cat, IDp, uid) {
  var text =
    ' <div  class="row pt-5"; >' +
    '<div class="col-md-2 offset-md-1">' +
    "   <img src=" +
    img1 +
    "></div>" +
    '<div class="col-md-6">' +
    "<h4>" +
    title1 +
    "</h4>" +
    "<p>" +
    desc1 +
    "</p>" +
    "<h4>valor: $" +
    precio1 +
    "</h4> </div>" +
    '<div class="col-md-2 offset-md-1">' +
    '<button class="btn btn-danger" onclick="verinteresados(' +
    "'" +
    cat +
    "','" +
    IDp +
    "','" +
    uid +
    "','" +
    title1 +
    "'" +
    ')">' +
    " Buscar Postulantes</button> </div>" +
    "<div id=" +
    IDp +
    "> </div></div>";

  return text;
}
function mostrarinfo(img1, title1, desc1, precio1, cat, IDp, uid,username,photo) {
  var text =
    ' <div  class="row pt-5"; >' +
    '<div class="col-md-2 offset-md-1">' +
    "   <img src=" +
    img1 +
    "></div>";
  
    text=text+'<div class="col-md-6">' +
    "<h4>" +
    title1 +
    "</h4>" +
    "<p>" +
    desc1 +
    "</p>" +
    "<h4>valor: $" +
    precio1 +
    "</h4> </div>" ;
    if (photo==null){
      text= text+'<div class="col-md-2 offset-md-1">' +
      "<h6>Contratado por:</h6><p>"+ username+"</p>";
    }
    else{
      text= text+'<div class="col-md-2 offset-md-1">' +
      
      "<h6>Realizado por:</h6><p>"+ username+"</p>";
    }
  
  

  return text;
}

function creartextosolicitud(img1, title1, desc1, precio1, cat, IDp, uid) {
  var text =
    ' <div  class="row pt-5"; >' +
    '<div class="col-md-2 offset-md-1">' +
    "   <img src=" +
    img1 +
    "></div>" +
    '<div class="col-md-6">' +
    "<h4>" +
    title1 +
    "</h4>" +
    "<p>" +
    desc1 +
    "</p>" +
    "</div>" +
    '<div class="col-md-2 offset-md-1">' +
    "<h2> $" +
    precio1 +
    "</h2> </div> </div>";

  return text;
}
function verinteresados(cat, IDp, uid, title) {
  var database = firebase
    .database()
    .ref("Usuario/" + uid + "/Publication/" + cat + "/" + IDp)
    .child("interesados");

  database.once("value").then(function(snapshot) {
    var c = 0,
      d = 0;
    var txt = "";
    var contenido = document.getElementById(IDp);
    contenido.innerHTML = txt;

    if (snapshot.val() == null) alert("No hay postulantes para este trabajo");

    snapshot.forEach(function(User) {
      d++;
      var id = User.key;
      var databas = firebase.database().ref("Usuario/" + id);
      txt = "<div id=" + IDp + d + "></div>";

      contenido.innerHTML = contenido.innerHTML + txt;
      var photo="",username="";
      databas.once("value", function(user) {
        photo=photo+user.child("photo").val();
        username=username+user.child("UserName").val();
        text = ' <div  class="row pt-5" ><div class="col-md-2 offset-md-1">';

        text =
          text +
          "<img  width='400px' src='" +
          photo +
          "'</img></div>";
        text = text + '<div class="col-md-6">';
        text = text + "<h4> Nombre: " + username + "</h4>";
        text =
        text + "<h4> Estrellas: " + user.child("star").val() + "</h4> </div>";
        text = text + "<div id='" + id + "'></div>";
        text =
          text +
          " <div class='col-md-2 offset-md-1'> <button class='btn btn-danger' onclick='contratar(" +
          '"' + IDp +'","' + uid +'","' +  id + '","' +
          cat + '","' + title + '","' + username+
          '","' +photo+ '"' + ")'>contratar</button></div>";
        c++;

        var cont = document.getElementById(IDp + c);
        cont.innerHTML = text;
      });
    });
  });
}
function contratar2(key, idPublicador, idContratado, cat, Titulo) {
  firebase
    .database()
    .ref("Usuario/" + idContratado + "/Acepted/" + cat + "/" + key)
    .set({
      Contratador: idPublicador,
      Titulo: Titulo,

      calification: 0
    });
}

function contratar(key, idPublicador, idContratado, cat, Titulo,nameC,photoC) {
  contratar2(key, idPublicador, idContratado, cat, Titulo);
  firebase
    .database()
    .ref("Usuario/" + idPublicador + "/P_Acepted/" + cat + "/" + key)
    .set({
      Titulo: Titulo,
      Contratado: idContratado,
      username: nameC,
      photo: photoC, 
      calification: 0
    });
  firebase
    .database()
    .ref("Publications/" + cat + "/" + key)
    .child("category")
    .set(null);

  alert("Se ha contratado");
  window.location.replace("anuncios.html");
}
function publicar(cat, IDp) {
  var contenido = document.getElementById("publicaciones");
  var txt = new Array();
  var database = firebase.database().ref("Publications/" + cat + "/" + IDp);
  database.once("value", function(child) {
    //TAKE ALL THE RESULTS ACCORDING TO THE CATEGORIE
    var desc1 = JSON.stringify(child.child("description"))
      .split('"')
      .join("");
    var title1 = JSON.stringify(child.child("title"))
      .split('"')
      .join("");
    var img1 = JSON.stringify(child.child("pic1"));
    var precio1 = JSON.stringify(child.child("valor"));
    contenido.innerHTML = creartexto(img1, title1, desc1, precio1, cat, IDp);
  });
}
function Pusuario() {
  document.getElementById("selena").innerHTML='<div class="btn-fila">'+
  '<button class="botonS"; onclick="Pusuario()"; >Publicaciones Realizadas</button>'+
  '<button class="botonf"; onclick="Request()"; >Solicitudes Pendientes</button>'+
  '<button class="botonf"; onclick="PublicacionesAceptadas(1)"; >Trabajos en proceso</button>'+
  '<button class="botonf"; onclick=" PublicacionesAceptadas(0)"; >Solicitudes Aceptadas</button>'+  
  '</div>';
  
  firebase.auth().onAuthStateChanged(function(user) {
    var uid = user.uid;
    firebase
      .database()
      .ref("Usuario/" + uid)
      .child("Publication")
      .once("value", function(snapshot) {
        snapshot.forEach(function(categoria) {
          var cat = categoria.key;
          texto = "";
          categoria.forEach(function(idpublicacion) {
            var IDp = idpublicacion.key;
            var contenido = document.getElementById("publicaciones");

            var database = firebase
              .database()
              .ref("Publications/" + cat + "/" + IDp);


            database.once("value", function(child) {
              if (child.val() != null) {
                var desc1 = JSON.stringify(child.child("description"))
                  .split('"')
                  .join("");
                var title1 = JSON.stringify(child.child("title"))
                  .split('"')
                  .join("");
                var img1 = JSON.stringify(child.child("pic1"));
                var precio1 = JSON.stringify(child.child("valor"));
                if (child.child("category").val() != null) {
                  texto =creartexto(img1, title1, desc1, precio1, cat, IDp, uid,1) +texto;
                 
                }
                else{
                  texto =' <div  class="row pt-5"; ><div class="col-md-2 offset-md-1">' +" <img src=" +
                  img1 +"></div>" +'<div class="col-md-6">' +"<h4>" +title1 +"</h4>" +
                  "<p>" +desc1 +"</p>" +"<h4>valor: $" + precio1 +"</h4> </div>" + '<div class="col-md-2 offset-md-1">' +
                  " <h6> Trabajo en Proceso</h6></div>" +"<div id=" +IDp + "> </div></div>" +texto;
                }
                contenido.innerHTML = texto;
              }
            });
          });
        });
      });
  });
  //alert(texto[0]);
}

function star(cal, uid, idPub, cat, P) {
  var database = firebase.database().ref("Usuario/" + uid);

  database.once("value").then(function(user) {
    var CalActual = user.child("star").val();
    var nCal = user.child("nCal").val();

    if (CalActual == null) {
      CalActual = 0;
      nCal = 0;
    }

    var promedio = CalActual * nCal;

    nCal = nCal + 1;

    promedio = promedio + cal;
    promedio = promedio / nCal;
    promedio = promedio.toFixed(2);

    firebase.database()
      .ref("Usuario/" + uid)
      .child("star")
      .set(promedio);

    firebase
      .database()
      .ref("Usuario/" + uid)
      .child("nCal")
      .set(nCal);

    borrarCal(P, cat, idPub);
    alert("¡Has calificado!");
    window.location.replace("anuncios.html")
  });
}

function borrarCal(P, cat, idPub) {
  firebase.auth().onAuthStateChanged(function(user) {
    var uid = user.uid;

    if (P == "1") {
      firebase
        .database()
        .ref("Usuario/" + uid + "/" + "P_Acepted" + "/" + cat + "/" + idPub)
        .child("Contratado")
        .set(null);
    }
    if (P == "0") {
      firebase
        .database()
        .ref("Usuario/" + uid + "/" + "Acepted" + "/" + cat + "/" + idPub)
        .child("Contratador")
        .set(null);
    }
  });

  
}

function PublicacionesAceptadas(type) {
  firebase.auth().onAuthStateChanged(function(user) {
    var uid = user.uid;
    var contenido = document.getElementById("publicaciones");
    contenido.innerHTML = "";
    var x;
    if (type){
      document.getElementById("selena").innerHTML='<div class="btn-fila">'+
      '<button class="botonf"; onclick="Pusuario()"; >Publicaciones Realizadas</button>'+
      '<button class="botonf"; onclick="Request()"; >Solicitudes Pendientes</button>'+
      '<button class="botonS"; onclick="PublicacionesAceptadas(1)"; >Trabajos en proceso</button>'+
      '<button class="botonf"; onclick=" PublicacionesAceptadas(0)"; >Solicitudes Aceptadas</button>'+  
      '</div>';
    x=firebase.database().ref("Usuario/" + uid).child("P_Acepted");
  }
    else {
      document.getElementById("selena").innerHTML='<div class="btn-fila">'+
      '<button class="botonf"; onclick="Pusuario()"; >Publicaciones Realizadas</button>'+
      '<button class="botonf"; onclick="Request()"; >Solicitudes Pendientes</button>'+
      '<button class="botonf"; onclick="PublicacionesAceptadas(1)"; >Trabajos en proceso</button>'+
      '<button class="botonS"; onclick=" PublicacionesAceptadas(0)"; >Solicitudes Aceptadas</button>'+  
      '</div>';
      x=firebase.database().ref("Usuario/" + uid).child("Acepted");
    }
    x.once("value", function(snapshot) {
        snapshot.forEach(function(categoria) {
          var cat = categoria.key;
          texto = "", txt="";
          var username;
          if (cat != null) {
              categoria.forEach(function(child) {
              idPubl = child.key;
              
              var ti = child.child("Titulo").val();
              var contratador;
              var db=firebase.database().ref("Publications/" + cat + "/" + idPubl);
              db.once("value", function(pub) {
           
              idPubl = db.key;
             
              if (type)
              {
                contratador=child.child("Contratado").val();
                username= child.child("username").val();
               // photo=child.child("photo").val();
              }
              else{
                contratador=child.child("Contratador").val();
              }
                
                if (contratador != null) {
                
                  txt =
                    "<button class='btn btn-danger' onclick='calificar(" + '"' +contratador + '"' + "," + '"' +idPubl + '"' +
                    "," + '"' + cat + '"' + "," + '"' +type+ '"' + "," + '"' +idPubl+contratador +'"' +
                    ")'>calificar</button><div id='" +idPubl+contratador + "'></div></div></div>";
                  
                } else {
                  
                  txt = "<h6>¡Trabajo Completado! </h6></div></div>";
                }
                    var desc1 = JSON.stringify(pub.child("description"))
                      .split('"')
                      .join("");
                    var title1 = JSON.stringify(pub.child("title"))
                      .split('"')
                      .join("");
                    var img1 = JSON.stringify(pub.child("pic1"));
                    var precio1 = JSON.stringify(pub.child("valor"));
                    
                    if (!type){
                       username=pub.child("username").val();
                       texto =
                        mostrarinfo(img1, ti, desc1, precio1, cat, idPubl, uid,username,null) +txt;
                    }
                       texto =
                        mostrarinfo(img1, ti, desc1, precio1, cat, idPubl, uid,username,1) +txt;
                      
                      contenido.innerHTML =  contenido.innerHTML+texto;

                });
              });
           
          }
        });
      });
  });
 
}



function calificar(id, idPub, cat, P,iddoc) {
  var contenido = document.getElementById(iddoc);
  var onclick="'"+id + "','" +idPub + "','" +cat + "','" +P +"'";
  texto = '<div class="ec-stars-wrapper">'+
'    <a onclick="star(this,'+onclick+');" value=1 title="Votar con 1 estrellas">&#9733;</a>'+
'    <a onclick="star(this,'+onclick+');" value=2 title="Votar con 2 estrellas">&#9733;</a>'+
'    <a onclick="star(this,'+onclick+');" value=3 title="Votar con 3 estrellas">&#9733;</a>'+
'    <a onclick="star(this,'+onclick+');" value=4 title="Votar con 4 estrellas">&#9733;</a>'+
'   <a onclick="star(this,'+onclick+');" value=5 title="Votar con 5 estrellas">&#9733;</a></div>';
 

  contenido.innerHTML = texto;
 
}

function Request() {
  document.getElementById("selena").innerHTML='<div class="btn-fila">'+
  '<button class="botonf"; onclick="Pusuario()"; >Publicaciones Realizadas</button>'+
  '<button class="botonS"; onclick="Request()"; >Solicitudes Pendientes</button>'+
  '<button class="botonf"; onclick="PublicacionesAceptadas(1)"; >Trabajos en proceso</button>'+
  '<button class="botonf"; onclick=" PublicacionesAceptadas(0)"; >Solicitudes Aceptadas</button>'+  
  '</div>';

  var texto = new Array();
  firebase.auth().onAuthStateChanged(function(user) {
    var uid = user.uid;
    firebase
      .database()
      .ref("Usuario/" + uid)
      .child("request")
      .once("value", function(snapshot) {
        snapshot.forEach(function(categoria) {
          categoria.forEach(function(idpublicacion) {
            cat = categoria.key;
            IDp = idpublicacion.key;
            texto = "";
            var contenido = document.getElementById("publicaciones");
            var txt = new Array();
            var database = firebase
              .database()
              .ref("Publications/" + cat + "/" + IDp);
            database.once("value", function(child) {
              if (child.val()!=null){
              //TAKE ALL THE RESULTS ACCORDING TO THE CATEGORIE
              var desc1 = JSON.stringify(child.child("description"))
                .split('"')
                .join("");
              var title1 = JSON.stringify(child.child("title"))
                .split('"')
                .join("");
              var img1 = JSON.stringify(child.child("pic1"));
              var precio1 = JSON.stringify(child.child("valor"));
              texto =creartextosolicitud(img1, title1, desc1, precio1,cat,IDp, uid) + texto;
              contenido.innerHTML = texto;
            }
            });
          });
        });
      });
  });
  //alert(texto[0]);
}
