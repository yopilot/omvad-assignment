import styled from 'styled-components'

export const Container = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 90vw;
  min-height: 480px;
  backdrop-filter: blur(10px);
  isolation: isolate;
  z-index: 1;
`

export const SignUpContainer = styled.div<{ $signIn: boolean }>`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.3s ease;
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
  background: linear-gradient(135deg, rgba(102, 126, 234, 1) 0%, rgba(118, 75, 162, 1) 100%);
  ${props => !props.$signIn ? `
    transform: translateX(100%);
    opacity: 1;
    z-index: 15;
  ` : null}
`

export const SignInContainer = styled.div<{ $signIn: boolean }>`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.3s ease;
  left: 0;
  width: 50%;
  z-index: 2;
  background: linear-gradient(135deg, rgba(102, 126, 234, 1) 0%, rgba(118, 75, 162, 1) 100%);
  ${props => !props.$signIn ? `transform: translateX(100%);` : null}
`

export const Form = styled.form`
  background: linear-gradient(135deg, rgba(102, 126, 234, 1) 0%, rgba(118, 75, 162, 1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
  border-radius: 15px 0 0 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
  isolation: isolate;
  z-index: 10;
`

export const Title = styled.h1`
  font-weight: 700;
  margin: 0 0 25px 0;
  color: #ffffff;
  font-size: 2.2rem;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  text-align: center;
`

export const Input = styled.input`
  background: rgba(255, 255, 255, 0.9);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  padding: 14px 18px;
  margin: 10px 0;
  width: 100%;
  color: #333333;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  
  &::placeholder {
    color: rgba(0, 0, 0, 0.6);
    font-weight: 400;
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.7);
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.92);
  }
`

export const Button = styled.button`
  border-radius: 10px;
  border: none;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  padding: 14px 36px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  margin-top: 15px;
  
  &:hover {
    background: linear-gradient(45deg, #5a6fd8, #6a4190);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }
`

export const GhostButton = styled(Button)`
  background: transparent;
  border: 2px solid #ffffff;
  color: #ffffff;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
`

export const Anchor = styled.a`
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  margin: 18px 0;
  transition: all 0.3s ease;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  
  &:hover {
    color: #ffffff;
    text-shadow: 0 2px 8px rgba(255, 255, 255, 0.6);
    transform: translateY(-1px);
  }
`

export const OverlayContainer = styled.div<{ $signIn: boolean }>`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 100;
  ${props => !props.$signIn ? `transform: translateX(-100%);` : null}
`

export const Overlay = styled.div<{ $signIn: boolean }>`
  background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c);
  background-size: 400% 400%;
  animation: gradientAnimation 8s ease infinite;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  isolation: isolate;
  z-index: 50;
  ${props => !props.$signIn ? `transform: translateX(50%);` : null}
  
  @keyframes gradientAnimation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`

export const OverlayPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
`

export const LeftOverlayPanel = styled(OverlayPanel)<{ $signIn: boolean }>`
  transform: translateX(-20%);
  ${props => !props.$signIn ? `transform: translateX(0);` : null}
`

export const RightOverlayPanel = styled(OverlayPanel)<{ $signIn: boolean }>`
  right: 0;
  transform: translateX(0);
  ${props => !props.$signIn ? `transform: translateX(20%);` : null}
`

export const Paragraph = styled.p`
  font-size: 14px;
  font-weight: 300;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`

export const ErrorMessage = styled.div`
  background: rgba(255, 107, 107, 0.9);
  border: 1.5px solid rgba(255, 107, 107, 0.7);
  border-radius: 12px;
  padding: 14px 16px;
  margin: 12px 0;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.2);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
`

export const SuccessMessage = styled.div`
  background: rgba(76, 217, 100, 0.9);
  border: 1.5px solid rgba(76, 217, 100, 0.7);
  border-radius: 12px;
  padding: 14px 16px;
  margin: 12px 0;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  box-shadow: 0 4px 16px rgba(76, 217, 100, 0.2);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
`
