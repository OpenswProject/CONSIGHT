import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignupPage.module.css';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password1 !== password2) {
      setError('두 개의 패스워드가 일치하지 않습니다.');
      return;
    }

    console.log('전송 데이터:', { username, email, password1, password2 }); // 전송 데이터 로깅

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password1, password2 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('백엔드에서 받은 전체 에러 응답:', errorData); // 전체 에러 데이터 출력

        let errorMessage = errorData.message || '회원가입 실패';
        if (errorData.data && Array.isArray(errorData.data)) { // errorData.errors 대신 errorData.data 확인
          errorMessage += '\n';
          errorData.data.forEach(err => { // errorData.errors 대신 errorData.data 순회
            console.log('개별 에러 객체 (data 배열 내부):', err); // 개별 에러 객체 전체 출력
            if (err.defaultMessage) {
              errorMessage += `- ${err.defaultMessage}\n`;
            } else if (err.field && err.code) {
              errorMessage += `- ${err.field}: ${err.code}\n`;
            } else {
              errorMessage += `- ${JSON.stringify(err)}\n`;
            }
          });
        }
        throw new Error(errorMessage);
      }

      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <h2>회원가입</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <div className={styles.formGroup}>
          <label htmlFor="username">사용자 이름</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password2">비밀번호 확인</label>
          <input
            type="password"
            id="password2"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className={styles.inputField}
            required
          />
        </div>
        <button type="submit" className={styles.signupButton}>회원가입</button>
      </form>
    </div>
  );
};

export default SignupPage;
