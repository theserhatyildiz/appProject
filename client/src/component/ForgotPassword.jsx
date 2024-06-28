import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    // ------------------Variables------------------
    const [userCreds, setUserCreds] = useState({
        email: "",
    });

    const [message, setMessage] = useState({
        type: "invisible-msg",
        text: "Dummy Msg"
    });

    const navigate = useNavigate();
    const loggedData = useContext(UserContext);

    console.log(loggedData);

    // ------------------Functions------------------
    function handleInput(event) {
        setUserCreds((prevState) => {
            return { ...prevState, [event.target.name]: event.target.value };
        });
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log(userCreds);

        // ------------------Sending the data to API------------------
        fetch("http://localhost:8000/forgotpassword", {
            method: "POST",
            body: JSON.stringify(userCreds),
            headers: {
                "Content-type": "application/json"
            }
        })
        .then(response => {
            if (response.status === 404) {
                setMessage({ type: "error", text: "Email Bulunumadı" });
            } else if (response.status === 403) {
                setMessage({ type: "error", text: "Hatalı Şifre" });
            } else if (response.status === 500) {
                setMessage({ type: "error", text: "Sunucu Hatası" });
            }

            setTimeout(() => {
                setMessage({ type: "invisible-msg", text: "Dummy Msg" });
            }, 100000);

            return response.json();
        })
        .then(data => {
            if (data.Status === "Success") {
                setMessage({ type: "success", text: "Şifre yenileme emaili gönderildi! Spam dosyanızı kontrol edin!" });
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
                    type="email"
                    onChange={handleInput}
                    placeholder="Email Girin"
                    name="email"
                    value={userCreds.email}
                    required
                />
                <button className="btn">Yolla</button>
                <div className="forgotPass-p">
                    <p>Üye misiniz? <Link to="/login">Giriş Yapın</Link></p>
                    <p className={message.type}>{message.text}</p>
                </div>
                
            </form>
        </section>
    );
}