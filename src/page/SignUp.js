import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom'; // Import useNavigate from 'react-router-dom'
import { callPotLogin } from '../api/UserAPICalls';
import styles from './SignUp.module.css';                 // Import your CSS module
import GoogleLogin from "../page/GoogleLogin";
import { useModal } from "src/components/hooks/use-modal";
import { Button } from "src/components/ui/button";
import { FindPasswordModal } from "src/components/modals/FindPassword-modal";
import { Mail, Lock} from "lucide-react";
import { jwtDecode } from 'jwt-decode';


export default function SignUp() {


  const accessToken = window.localStorage.getItem('accessToken');
  // const decodedToken = accessToken ? jwtDecode(accessToken) : null;

  const navigate = useNavigate(); // Initialize navigate for navigation

  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [pwValid, setPwValid] = useState(false);
  const [notAllow, setNotAllow] = useState(true);
  const dispatch = useDispatch();

  const { onOpen } = useModal();

  const user = {
    userEmail: email,
    password: pw,
  };

  useEffect(() => {
    if (emailValid && pwValid) {
      setNotAllow(false);
      return;
    }
    setNotAllow(true);
  }, [emailValid, pwValid]);

  const handleEmail = (e) => {
    setEmail(e.target.value);
    const regex =
      /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (regex.test(e.target.value)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };

  const handlePw = (e) => {
    setPw(e.target.value);
    const regex =
      /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
    if (regex.test(e.target.value)) {
      setPwValid(true);
    } else {
      setPwValid(false);
    }
  };

  const onClickConfirmButton = () => {
    dispatch( callPotLogin(user) )
  };
  

  const onClickSignUpButton = () => {
    // Add your logic for handling sign-up button click
    // For example, navigate to the sign-up form
    navigate('/sign-up-form');
  };



  const onClickTest = () =>{
  }

  if(accessToken){
    return <Navigate to="/" replace />
  }

  const handleKeyDown = (event) => {
    const key = event.code;
    switch(key){
      case 'Enter':
        onClickConfirmButton()
        break;
      default:
    }
  }


  return (
      <div className={styles.full}>
        <div className={styles.page}>
          <h1 onClick={() => onClickTest()} className={styles.titleWrap}>
            Login
          </h1>

          <div>
            {/*<div className={styles.inputTitle}>이메일 주소</div>*/}
            <div className={`${styles.inputWrap} ${!emailValid && email.length > 0 ? styles.error : ''}`}>
              <Mail />
              <input
                className={styles.input}
                type="text"
                placeholder="test@gmail.com"
                value={email}
                onChange={handleEmail}
              />
            </div>

            <div className={styles.errorMessageWrap}>
              {!emailValid && email.length > 0 && <div>올바른 이메일을 입력해주세요.</div>}
            </div>

            {/*<div className={styles.inputTitle}>비밀번호</div>*/}
            <div className={`${styles.inputWrap} ${!pwValid && pw.length > 0 ? styles.error : ''}`}>
              <Lock />
              <input
                className={styles.input}
                type="password"
                placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                value={pw}
                onChange={handlePw}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className={styles.errorMessageWrap}>
              {!pwValid && pw.length > 0 && <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>}
            </div>
          </div>
          <div
            onClick={() => onOpen("findPassword")}
            className={styles.findPassword}
          >
            forgot your password?
          </div>
          <div>
            <button onClick={onClickSignUpButton} className={styles.bottomButton}>
              SingUp
            </button>
            <button onClick={onClickConfirmButton} disabled={notAllow} className={styles.bottomButton}>
              Login
            </button>
            {/*<Button*/}
            {/*    onClick={() => onOpen("findPassword")}*/}
            {/*    className={styles.bottomButton}*/}
            {/*    type={"button"}*/}
            {/*>*/}
            {/*  forgot your password*/}
            {/*</Button>*/}
            <div className={ styles.googleLogin}>
              <GoogleLogin />
            </div>
          </div>
          <FindPasswordModal />

        </div>
      </div>
  )
}