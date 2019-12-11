
  
async function foo(){
  var t =1;
  t = await test();
  var tt = document.getElementById("test");
  tt.innerHTML = t;
  console.log('foo');
}

function test(){
  return new Promise((resolve)=>{
    setTimeout(function(){
      console.log('test');
      resolve(2);
    },1000);
  })
}

 function foo1(){
  var t =1;
  t =  test();
  var tt = document.getElementById("test");
  tt.innerHTML = t;
  console.log('foo')
}