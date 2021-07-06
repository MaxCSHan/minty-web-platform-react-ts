import firebase,{usersRef} from "../setup/setupFirebase";

const ifRegistered = (email:string) => usersRef.orderByChild("username").equalTo(email).once("value",snapshot => {
    if (snapshot.exists()){
        snapshot.exists();
    }
});