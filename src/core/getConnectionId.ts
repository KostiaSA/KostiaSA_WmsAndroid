
//if (!localStorage.getItem("buhta-connection-id"))
  //  localStorage.setItem("buhta-connection-id", Math.random().toString(36).slice(2));


let id:string=Math.random().toString(36).slice(2);

export function getConnectionId() {
    //todo save to localStorage
    return id;
    //return localStorage.getItem("buhta-connection-id");
}