
import http from "./httpService";

export function getEvents (){
    return http.get("http://localhost:5000/event")
}