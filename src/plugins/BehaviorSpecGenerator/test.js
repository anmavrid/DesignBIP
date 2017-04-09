/**
 * Created by Venki on 4/9/2017.
 */
/* var a=[];

for(var i=0;i<10;i++){
    a[i]=i;
    console.log(a[i]);
}

//a=[];
a.length=0;

for(var i=0;i<10;i++){
    console.log(a[i]);
} */

var dic={}

dic[0]=0;
dic[1]=1;
dic[2]=2;
dic[3]=3;

for(var i in dic){
    console.log(dic[i]);
}

dic.length=0;

for(var i in dic){
    console.log(dic[i]);
}