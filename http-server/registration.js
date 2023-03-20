let x = document.getElementById("registration_form")

const Get_User_Details = () =>{
    let details_user=localStorage.getItem("user-entry");
    if (details_user){
        details_user=JSON.parse(details_user);
    }else{
        details_user=[];
    }
    return details_user;
}
let User_Details = Get_User_Details();

const Display_User_Details =()=>{
    const details=Get_User_Details();

    const entrytable = details.map((data) =>{
        const cell_name=`<td class = 'border border-indigo-700 px-3 py-2'>${data.n}</td>`;
        const cell_email=`<td class = 'border border-indigo-700 px-3 py-2'>${data.e}</td>`;
        const cell_password=`<td class = 'border border-indigo-700 border-indigo-700 px-3 py-2'>${data.p}</td>`;
        const cell_dob=`<td class = 'border border-indigo-700 px-3 py-2'>${data.d}</td>`;
        const cell_tc=`<td class = 'border border-indigo-700 px-3 py-2'>${data.tc}</td>`;

        const finalrow = `<tr>${cell_name} ${cell_email} ${cell_password} ${cell_dob} ${cell_tc}</tr>`;
        return finalrow;
    }).join("\n");

    const user_table =`<table class=" table-auto w-90% "><tr>
    
    <th class="pr-7">Name</th>
    <th class="pr-7">Email</th>
    <th class="pr-7">Password</th>
    <th class="pr-7">Dob</th>
    <th class="pr-7">Accepted terms?</th>
    </tr>${entrytable} </table>`;
let final = document.getElementById("user-entry");
final.innerHTML = user_table;
}



const Saving_User_Details = (a) => {
a.preventDefault();
const n = document.getElementById("name").value;
const e = document.getElementById("email").value;
const p = document.getElementById("password").value;
const d = document.getElementById("dob").value;
const tc = document.getElementById("t&c").checked;
const user_entry = {n,e,p,d,tc};
User_Details.push(user_entry);
localStorage.setItem("user-entry", JSON.stringify(User_Details));
Display_User_Details();
}
x.addEventListener("submit", Saving_User_Details);
Display_User_Details();




const check_date = () =>{
today_date = new Date();
var d = today_date.getDate();
var m = today_date.getMonth()+1;
var y = today_date.getFullYear();

const dob = document.getElementById("dob").value;
const dob_array = dob.split('-');
year=Number(dob_array[0]);
month=Number(dob_array[1]);
day=Number(dob_array[2]);

if (y-year<18 || y-year>55){
    return False
}else if( y-year>18 && y-year<55){
    return True 
}else{
    if (y-year==18){
        if (m>=month && d>=day){
            return True
        }else {return False}
    }else if (y-year==55){
        if (m>=month && d>=day){
            return True
        }else {return False}
    }else{return False}
}
}
