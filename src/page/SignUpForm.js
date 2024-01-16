// SignUpForm.js
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { callPostSignUp, callPostMail, callPostCheck } from '../api/UserAPICalls';
import { User, Smartphone, Mail, MailCheck, LockKeyhole, Lock, SquareUserRound } from "lucide-react";

import styles from './SignUpForm.module.css'


const SignUpForm = () => {
    const [userName, setUserName] = useState('');
    const [nickname, setNickname] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userSubmit, setUserSubmit] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const [check, setCheck] = useState(false);
    const [language, setLanguage] = useState('');
    const [click, setClick] = useState(false);

    const navigate = useNavigate(); // Initialize navigate for navigation
    const dispatch = useDispatch();

    const data = useSelector(state => state.checkReducer);
    const [stateData, setStateData] = useState(data);


    const handleNameChange = (e) => {
    setUserName(e.target.value);
    };

  const handleNicknameChange = (e) =>{
    setNickname(e.target.value);
  }

  const handleEmailChange = (e) => {
    setUserEmail(e.target.value);
  };
    const handleSubmitChange = (e) => {
        const regex =
            /^[0-9]+$/
        if (regex.test(e.target.value) || e.target.value === '')
        setUserSubmit(e.target.value);
    };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
      if(e.target.value == checkPassword){
          setCheck(true);
      } else{
          setCheck(false);
      }
  };

    const handleCheckPasswordChange =  (e) => {
        setCheckPassword(e.target.value);
        if(e.target.value == password){
            setCheck(true);
        } else{
            setCheck(false);
        }
    };

    const handleLanguageChange = (e) =>{
        setLanguage(e.target.value)
    }

  const handleUserPhone = (e) => {
    setUserPhone(e.target.value);
  };

  
  const user = {
    name : userName,
    nickname : nickname,
    userEmail: userEmail,
    password: password,
    userPhone : userPhone,
    userSubmit:userSubmit,
    nationalLanguage : language
  };


    const onClickSignUp = () =>{
        if(userName && userPhone && userEmail && check && data.data && data.status == 200 && language){
            window.location.href = '/'
            dispatch(callPostSignUp(user))
        } else{
            alert("입력하신 정보를 확인해주시길 바랍니다.")
        }
    }
  const handleKeyDown = (event) => {
    const key = event.code;
    switch(key){
      case 'Enter':
        onClickSignUp()
        break;
      default:
    }
  }


  const onClickMail = () =>{
      dispatch(callPostMail(userEmail))
  }

  const onClickCheck = () =>{
      dispatch(callPostCheck(userSubmit))
  }

    const onClickTest = () =>{
    }


  return (
      <div className={styles.full}>
        <div className={styles.page}>
            <div onClick={onClickTest} className={styles.titleWrap}>
                <h1>Sign Up</h1>
            </div>
            <div>

                {/*<div className={styles.inputTitle}>이름</div>*/}
                <div className={`${styles.inputWrap}`}>
                    <User />
                    <input className={styles.input}
                           type="text" value={userName}
                           onChange={handleNameChange}
                           placeholder={"Your Name"}
                    />
                </div>

                {/*<div className={styles.inputTitle}>닉네임</div>*/}
                <div className={`${styles.inputWrap}`}>
                    <SquareUserRound />
                    <input className={styles.input}
                           type="text" value={nickname}
                           onChange={handleNicknameChange}
                           placeholder={"Nickname"}
                    />
                </div>

                {/*<div className={styles.inputTitle}>전화번호</div>*/}
                    <div className={`${styles.inputWrap}`}>
                    <Smartphone />
                    <input className={styles.input}
                           type="text" value={userPhone}
                           onChange={handleUserPhone}
                           placeholder={"Your PhoneNumber"}
                    />
                </div>

                {/*<div className={styles.inputTitle}>이메일</div>*/}
                <div className={`${styles.inputWrap}`}>
                    <Mail />
                    <input className={styles.input}
                       type="email" value={userEmail}
                       onChange={handleEmailChange}
                           placeholder={"Your Email"}
                    />
                    <button onClick={onClickMail} className={styles.submit}>Send</button>
                </div>


                {/*<div className={styles.inputTitle}>이메일 인증</div>*/}
                <div className={`${styles.inputWrap}`}>
                    <MailCheck />
                    <input className={styles.input}
                       type="text" value={userSubmit}
                       onChange={handleSubmitChange}
                           placeholder={"Email Check"}
                    />
                    <button onClick={onClickCheck} className={styles.submit}>Check</button>
                </div>
                {data &&
                    <div style={ data.status == 200 ? {color:"green"}: {color:"red"} }>
                        {data.data}
                    </div>
                }
                {/*<div className={styles.inputTitle}>비밀번호</div>*/}

                <div className={`${styles.inputWrap}`}>
                    <Lock />
                    <input
                    className={styles.input}
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyDown={handleKeyDown}
                    placeholder={"Password"}
                    />
                </div>
                {/*<div className={styles.inputTitle}>비밀번호 확인</div>*/}
                <div className={`${styles.inputWrap}`}>
                    <LockKeyhole />
                    <input
                        className={styles.input}
                        type="password"
                        value={checkPassword}
                        onChange={handleCheckPasswordChange}
                        onKeyDown={handleKeyDown}
                        placeholder={"Password Check"}
                    />
                </div>
                <div style={ checkPassword == '' ? {display:"none"}  : {display:"block"}}>
                    {checkPassword && checkPassword== password ?
                        <div style={ {color:"green"} }>
                            일치합니다
                        </div>:
                        <div style={ {color:"red"} }>
                            불일치합니다.
                        </div>
                    }
                </div>
                <div className={styles.inputTitle}></div>
                <select className={styles.input} onChange={handleLanguageChange}>
                    <option className={styles.input} value="언어선택" disabled selected hidden>
                        language
                    </option>
                    <option className={styles.input} value="kor_Hang">Korean</option>
                    <option className={styles.input} value="eng_Latn">English</option>
                    <option className={styles.input} value="jpn_Jpan">Japanese</option>
                </select>
            </div>
          <div>
            <button onClick={() => onClickSignUp()} disabled={!userName || !userPhone || !userEmail || !check || data.data < 1 || data.status == 500 || !language} className={styles.bottomButton}>
                Sign up
            </button>
          </div>
        </div>
      </div>
  );
};

export default SignUpForm;