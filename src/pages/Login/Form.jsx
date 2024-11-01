import { Button, Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import Loader from "./loader";
import "./FormStyle.css";
import { useTranslation } from "react-i18next";
import { TranslateContext } from "../../TranslateContext/TransContext";
import logo from "../../../src/assets/logo.png"

export default function Form() {
  const { t, i18n } = useTranslation("global");
  const { handleChangeLanguage } = useContext(TranslateContext);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("login.invalidEmail"))
      .required(t("login.requiredEmail")),
    password: Yup.string()
      .min(6, t("login.invalidPassword"))
      .required(t("login.requiredPassword")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const nav = useNavigate();

  const save = async (data) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log("User signed in: ", userCredential.user);
      localStorage.setItem("id", auth.currentUser.uid);
      nav("/");
    } catch (error) {
      setErrorMessage(t("login.loginError") + error.message);
    } finally {
      setLoading(false);
    }
  };

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  return (
    <div className="form h-screen">

      <div
        className="form-container sm:w-full xs:w-[80%] xs:mx-auto"
        dir={direction}
      >
        <div>
          {loading ? (
            <Loader />
          ) : (
            <div className="form-overlay justify-center flex items-center xs:p-0 sm:p-[20px]">
              <form onSubmit={handleSubmit(save)}>
                <div
                  className={`flex xs:w-[90%] xs:mx-auto xs:px-10 xs:py-20 sm:w-[500px] sm:mx-0 flex-col gap-4 sm:p-20 rounded-lg ${
                    direction === "rtl" ? "text-right" : "text-left"
                  }`}
                >
                  <img
                    src={logo}
                    alt=""
                    width={"100%"}
                    className="-mt-20 m-auto"
                  />

                  <div className="">
                    <div className="mb-2 block">
                      <Label
                        htmlFor="email1"
                        value={t("login.email")}
                        className="text-white"
                      />
                    </div>
                    <TextInput
                      {...register("email")}
                      id="email1"
                      type="text"
                      aria-placeholder="name@.com"
                      className={
                        direction === "rtl" ? "text-right" : "text-left"
                      }
                      required
                    />
                    {errors.email && (
                      <p className="text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <div className="mb-2 block">
                      <Label
                        htmlFor="password1"
                        value={t("login.password")}
                        className="text-white"
                      />
                    </div>
                    <TextInput
                      {...register("password")}
                      id="password1"
                      type="password"
                      className={
                        direction === "rtl" ? "text-right" : "text-left"
                      }
                      required
                    />
                    {errors.password && (
                      <p className="text-red-600">{errors.password.message}</p>
                    )}
                  </div>

                  {errorMessage && (
                    <p className="text-red-600 text-center">{errorMessage}</p>
                  )}

                  <Button
                    type="submit"
                    style={{ backgroundColor: "#CDA03D", marginTop: 20 }}
                  >
                    {t("login.loginButton")}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
