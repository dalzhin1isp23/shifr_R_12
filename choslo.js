let chislo = prompt ("ввидите слово")
let palidrom=false
if (chislo.length % 2 == 0 ){
 
    for (let i=0;chislo.length/2>i;i++){
        if (chislo[i]==chislo[chislo.length-i-1]){
            palidrom=true
        }else{
            palidrom=false
            break
        }
        
    }
}else{
    for (let i=0;(chislo.length/2)>i;i++){
        if (chislo[i]==chislo[chislo.length-i-1]){
            palidrom=true
            
        }else{
            
            palidrom=false
            break
        }
        
    }
}

alert(palidrom)