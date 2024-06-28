import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
    const [userCreds, setUserCreds] = useState({ password: "" });
    const [message, setMessage] = useState({ type: "invisible-msg", text: "Dummy Msg" });
    const navigate = useNavigate();
    const loggedData = useContext(UserContext);

    const { id, token } = useParams();

    console.log(loggedData);

    function handleInput(event) {
        setUserCreds((prevState) => ({ ...prevState, [event.target.name]: event.target.value }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log(userCreds);

        fetch(`https://galwin-7487fa6a2294.herokuapp.com/resetpassword/${id}/${token}`, {
            method: "POST",
            body: JSON.stringify(userCreds),
            headers: { "Content-type": "application/json" }
        })
        .then(response => {
            if (response.status === 404) {
                setMessage({ type: "error", text: "User not found" });
            } else if (response.status === 403) {
                setMessage({ type: "error", text: "Invalid token" });
            } else if (response.status === 500) {
                setMessage({ type: "error", text: "Server error" });
            }

            setTimeout(() => {
                setMessage({ type: "invisible-msg", text: "Dummy Msg" });
            }, 3000);

            return response.json();
        })
        .then(data => {
            if (data.Status === "Success") {
                setMessage({ type: "success", text: "Şifre başarıyla değiştirildi!" });
                setTimeout(() => {
                    navigate('/login');
                }, 3000); // 3 seconds delay before hiding the message and redirecting
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    return (
        <section className="container">
            <form className="form" onSubmit={handleSubmit}>
                <h1>Şifre Yenileme</h1>
                <input 
                    className="inp" 
                    type="password" 
                    onChange={handleInput} 
                    placeholder="Yeni Şifreyi Girin" 
                    name="password" 
                    value={userCreds.password} 
                    required
                />
                <button className="btn">Oluştur</button>
                <p className={message.type}>{message.text}</p>
            </form>
        </section>
    );
}