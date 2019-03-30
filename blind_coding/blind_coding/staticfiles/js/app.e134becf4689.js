// var request = require('request');

$(document).ready(function() {
	var inp = document.getElementsByClassName('noselect')[0];
getQuestion(0);
inp.addEventListener('select', function() {
  this.selectionStart = this.selectionEnd;
}, false);
	
	document.addEventListener('contextmenu', event => event.preventDefault());
    var ctrlDown = false,
        ctrlKey = 17,
        cmdKey = 91,
        vKey = 86,
        cKey = 67;

    $(document).keydown(function(e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = true;
    }).keyup(function(e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
    });

    $(".no-copy-paste").keydown(function(e) {
        if (ctrlDown && (e.keyCode == vKey || e.keyCode == cKey)) return false;
    });
    
    // Document Ctrl + C/V 
    $(document).keydown(function(e) {
        if (ctrlDown && (e.keyCode == cKey)) console.log("Document catch Ctrl+C");
        if (ctrlDown && (e.keyCode == vKey)) console.log("Document catch Ctrl+V");
    });
	
});
const languages = ['c','java','cpp','cpp14','python2','python3'];

const versions = ['0','1','2'];

var code = `
#include <stdio.h>
int main(){
  printf("Hello World num entered is :");
  return 0;
}`;

let langNo = 0;
let versionNo = 0;
let input = '1';
let output = '';
let qNo=0;
let tc1 = '';
let tc2 = '';
let tc3 = '';

const setCode = (prog)=>{
  code = prog;
};

const getCode = () => {
  return code;
};


const setLanguage = (langNum) => {
  langNo = langNum;
};

const getLanguage = () => {
  return langNo;
};


const setVersion = (vrsn) => {
  versionNo = vrsn;
};

const getVersion = () => {
  return versions[versionNo];
}

const setCustomInput = (inp)=>{
  input = inp;
}

const getCustomInput = ()=>{
  return input;
}

const setOutput = (outp) => {
  console.log('Result:',outp);
  output = outp;
};

const getOutput = () => {
  return output;
};

const runCode = () => {
  stopClock();
	console.log('time elapsed is: ',start);
  let prog = document.getElementById("codeInput").value;
  setCode(prog);

  let lang = document.getElementById("langSelect").value;
  setLanguage(lang);

  console.log('Language: ',getLanguage(),'code: ',getCode());


  var program = {
      script : getCode(),
      language: getLanguage(),
      versionIndex: getVersion(),
      clientId: "222a2ef84f6881409d32ae21369d1a32",
   	  clientSecret:"67872757630a355db890ee74b6b20926cb9e025dbb444182df2bd2700fc64af1",
      stdin: getCustomInput(), //to give custom input
	  qNo: getQNum(),
	  timeElapsed: start
  };

  //just send this object to jdoodle url and send back the response
  // for all test cases backend checks the output and returns no of test cases cleared
  let resp = sendRequest('POST','runCode/',program);
	

};

function getCookie(name) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}


const sendRequest = (method,url,data) => {   
 var csrf_token = getCookie('csrftoken');
  var ourRequest = new XMLHttpRequest();
  ourRequest.open(method,url, true);
  ourRequest.setRequestHeader("Content-type", "application/json");
  ourRequest.setRequestHeader("X-CSRFToken", csrf_token);
  ourRequest.onload = function() {
    if (ourRequest.status >= 200 && ourRequest.status < 400) {
      // console.log('output: ');
		if(url == 'runCode/'){
		  let recievedData = JSON.parse(ourRequest.responseText);
		  setOutput(recievedData);
		  document.getElementById("compilerOutput").value = getOutput().output;
		  document.getElementById('score').innerHTML = recievedData['score'];
		  console.log(recievedData['score']);
		  if(getOutput().output == 'Correct Answer')
			  start = 0;
//		  startClock();
		  return recievedData;
		}
		else{
			let recievedData = JSON.parse(ourRequest.responseText);
			let inpt = recievedData['sampIn'].split(' ');
			let inStr = '';
			for(let i=0;i<inpt.length;i++)
			{
				inStr+=inpt[i];
				inStr+='\n';
			}
			let que = recievedData['question'] + '<br><br>'+'Sample Input'+'<br>'+recievedData['sampTCNum']+'<br>'+inStr+'<br><br>'+'Sample Output'+'<br>'+recievedData['sampleOut'];
			console.log('hi ',recievedData);
  			document.getElementsByClassName('left')[0].innerHTML=que;
			qNo = recievedData['qNo'];
			console.log(qNo);
			console.log(recievedData['userScore']);
			document.getElementById('score').innerHTML = recievedData['userScore'];
			return recievedData;
		}
    } else {
      // Nothing
		startClock();
    }
  }
  ourRequest.onerror = function() {
    // Nothing
//	  startClock();
  }
  console.log(JSON.stringify(data));
  ourRequest.send(JSON.stringify(data));
};


const getQuestion = (queNum) => {
//  start = 0;
  startClock();
  let data = {
    queNum : queNum
  };
  sendRequest('POST','/question/',data);
};

function getQNum(){
	return qNo;
}

window.onresize = function(){
    if ((window.outerHeight - window.innerHeight) > 100) {
        // console was opened (or screen was resized)
		alert("Sorry!! you will be logged out since you didn't follow instructions");
		window.location.href="/logout"
    }
}














function getCookie(name) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}
function login() {
  var csrf_token = getCookie('csrftoken');
  var ourRequest = new XMLHttpRequest();
  ourRequest.open("POST","login/", true);
  ourRequest.setRequestHeader("X-CSRFToken", csrf_token);
  ourRequest.setRequestHeader("Content-type", "application/json");
  ourRequest.onload = function() {
    if (ourRequest.status >= 200 && ourRequest.status < 400) {
		;
    } else {
    }
  }
  ourRequest.onerror = function() {
    // Nothing
  }
  ourRequest.send();
}

window.onload = () => {
    startClock();
}

function showAbout() {
    document.getElementsByClassName('about')[0].style.display = 'flex';
    document.getElementsByClassName('backdrop')[0].style.display = 'block';
}

function closeAbout() {
    document.getElementsByClassName('about')[0].style.display = 'none';
    document.getElementsByClassName('backdrop')[0].style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
	console.log('hikljhg');
//    var instances = M.FormSelect.init(elems, options);
  });

  // Or with jQuery

  $(document).ready(function(){
    $('select').formSelect();
  });

  $(document).delegate('#codeInput', 'keydown', function(e) {
    var keyCode = e.keyCode || e.which;
  
    if (keyCode == 9) {
      e.preventDefault();
      var start = this.selectionStart;
      var end = this.selectionEnd;
  
      // set textarea value to: text before caret + tab + text after caret
      $(this).val($(this).val().substring(0, start)
                  + "\t"
                  + $(this).val().substring(end));
  
      // put caret at right position again
      this.selectionStart =
      this.selectionEnd = start + 1;
    }
  });

  let hamburger = document.querySelector(".hamburger");

hamburger.onclick = function(e){
  e.preventDefault;
  if(hamburger.classList.contains("active")){
    hamburger.classList.remove("active");
    hamburger.style.transform = 'translateX(0)';
    document.getElementById('sidenav').style.transform = 'translateX(-100%)';
  }else{
    hamburger.classList.add("active");
    hamburger.style.transform = 'translateX(21vw)';
    document.getElementById('sidenav').style.transform = 'translateX(0)';
  }
}

function Submit() {
    
}

let start = 0;
let timerInterval;
function startClock() {
    timerInterval = setInterval(increaseTime, 1000);
    function increaseTime() {
        ++start;
        if(start >= 60) {
            if(start%60>=10) {
                document.getElementById('timer').innerHTML = "0" + Number(Math.floor(start/60)) + ':' + Number(start%60);
            } else {
                document.getElementById('timer').innerHTML = "0" + Number(Math.floor(start/60)) + ':0' + Number(start%60);
            }
        } else if(start < 60 && start >= 10){
            document.getElementById('timer').innerHTML = '00:' + Number(start);
        } else if(start < 10) {
            document.getElementById('timer').innerHTML = '00:0' + Number(start%60);
        }
//		console.log('Elapsed time: ',start);
    }
}

function stopClock() {
    clearInterval(timerInterval);
}