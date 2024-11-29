import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios"
import { useParams } from "react-router-dom";
import UpButton from "../components/UpButton";
import { BASE_URL } from "../components/BASE_URL";
import ScrollToTop from "../components/ScrollToTop";
//import assets
import Communication from "../assets/icon_communication.svg";
import Thanks from "../assets/icon_thanks.svg";
import Relax from "../assets/icon_relax.svg";
import Achievement from "../assets/icon_achievements.svg";
import Challenge from "../assets/icon_challenge.svg";
import Emotion from "../assets/icon_emotions.svg";
import Pencil from "../assets/icon_pencil.svg";
import Beverage from "../assets/icon_beverage.svg";
import Music from "../assets/icon_music.svg";
import Food from "../assets/icon_food.svg";
import Video from "../assets/icon_video.svg";
import ShowEye from "../assets/icon_showPW.svg";
import hideEye from "../assets/icon_hidePW.svg";

const activityImages = [Beverage, Music, Food, Video];
const messages = [
    "오늘은 음료수가 생각나네요!",
    "음악과 함께하는 하루 어떠세요?",
    "맛있는 음식으로 기분 전환!",
    "영상 한 편 보면서 쉬어가요!"
];

const categoryImages = {
    "소통": Communication,
    "감사": Thanks,
    "휴식": Relax,
    "성취": Achievement,
    "도전": Challenge,
    "감정": Emotion
};

const DailyDetailPage = () => {

    const { id } = useParams();
    const [like, setLike] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [randomIndex] = useState(() => Math.floor(Math.random() * activityImages.length));
    const [showTextModal, setShowTextModal] = useState(false);
    const [apiText, setApiText] = useState('');
    const [showDrawingModal, setShowDrawingModal] = useState(false);
    const [drawingApiText, setDrawingApiText] = useState('');
    const [diaryData, setDiaryData] = useState([]);
    const [date, setDate] = useState("");
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [author, setAuthor] = useState('');
    const [password, setPassword] = useState('');
    const [modalType, setModalType] = useState('');
    const [showPasswordError, setShowPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(true);

    useEffect(() => {
        const fetchDiary = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/diaries/${id}`); 
                setDiaryData(response.data);
                setDate(response.data.created_at);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching diary:", error);
            }
        };
        fetchDiary();
    }, [id, like]);

    useEffect(() => {
        if (apiText) {
            console.log("API Text Updated:", apiText);
        }
    }, [apiText]);

    const validatePassword = (inputPassword) => {
        return inputPassword === "1234";
    };
    
    const handleLike = () => {
        setLike((prev) => !prev);
    };

    const handleEditClick = (type) => {
        setModalType(type);
        setShowAuthModal(true);
        setShowPasswordError(false);
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setIsPasswordValid(newPassword.length >= 4);
    };

    const handleWriteAPI = () => {
        setShowTextModal(true);
        const fetchWriteAPI = async () => {
            try {
                const response = await axios.post(`${BASE_URL}/diaries/adaptation`, {
                    id : id,
                    password : "1234",
                }); 
                setApiText(response.data.adapted_content);
            } catch (error) {
                console.error("Error fetching diary:", error);
            }
        };
        fetchWriteAPI();
    }

    const validateAuth = (inputAuthor, inputPassword) => {
        return inputAuthor === "하루" && inputPassword === "1234";
    };

    const handleAuthSubmit = async () => {
        try {
            const validationResponse = await axios.post(`${BASE_URL}/diaries/adaptation`, {
                id: id,
                password: password,
            });
    
            if (validationResponse.data.adapted_content !== null) {
                if (modalType === 'text') {
                    setApiText(validationResponse.data.adapted_content);
                    setShowAuthModal(false);
                    setTimeout(() => {
                        setShowTextModal(true);
                    }, 100);
                } else if (modalType === 'drawing') {
                    const drawingResponse = await axios.post(`${BASE_URL}/diaries/drawing-adaptation`, {
                        id: id,
                        password: password,
                    });
                    setDrawingApiText(drawingResponse.data.adapted_drawing);
                    setShowAuthModal(false);
                    setTimeout(() => {
                        setShowDrawingModal(true);
                    }, 100);
                }
                
                setAuthor('');
                setPassword('');
                setShowPasswordError(false);
            } else {
                setShowPasswordError(true);
            }
        } catch (error) {
            console.error("Error:", error);
            setShowPasswordError(true);
        }
    };

    return (
        <Container>
            <ScrollToTop />
            <Content>
                <Header>
                    <CategoryAndDate>
                        <CategoryLabel>
                            <img 
                                src={categoryImages[diaryData.category]} 
                                alt="category" 
                                width="32" 
                                height="32" 
                            />
                            {diaryData.category}
                        </CategoryLabel>
                    </CategoryAndDate>
                    <AuthorSection>
                        <Author>하루님의 로그</Author>
                        <Date>{date.slice(0,10)}</Date>
                    </AuthorSection>
                </Header>
    
                <DrawingBox>
                    {diaryData.image_data && (
                        <DrawingImage src={diaryData.image_data} alt="diary drawing" />
                    )}
                    <EditButton onClick={() => handleEditClick('drawing')}>
                        <img src={Pencil} alt="edit" width="32" height="32" />
                    </EditButton>
                </DrawingBox>
    
                <TextBox>
                    <TextContent>
                        {diaryData.content}
                    </TextContent>
                    <EditButton onClick={() => handleEditClick('text')}>
                        <img src={Pencil} alt="edit" width="32" height="32" />
                    </EditButton>
                </TextBox>
    
                <ActionBar>
                    <LikeCount>추천 {diaryData.likes}</LikeCount>
                    <ButtonContainer>
                        <StyledUpButtonWrapper>
                            <UpButton 
                                diaryId={id}
                                isLiked={like} 
                                onLike={handleLike}
                            >
                                추천
                            </UpButton>
                        </StyledUpButtonWrapper>
                        <WriteButton onClick={() => setShowModal(true)}>
                            내일 뭐하지? ✨
                        </WriteButton>
                    </ButtonContainer>
                </ActionBar>
            </Content>

            {showModal && (
                <ModalOverlay>
                    <Modal>
                        <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
                        <ModalTitle>오늘 하루도 고생 많았어요</ModalTitle>
                        <ModalImage src={activityImages[randomIndex]} alt="activity suggestion" />
                        <ModalText>내일은 "{messages[randomIndex]}"</ModalText>
                    </Modal>
                </ModalOverlay>
            )}

            {showDrawingModal && (
                <ModalOverlay>
                    <Modal>
                        <CloseButton onClick={() => setShowDrawingModal(false)}>×</CloseButton>
                        <ModalTitle>오늘 하루도 고생 많았어요</ModalTitle>
                        <DrawingApiBox>
                            {drawingApiText || "AI 그림 들어가는 곳입니다"}
                        </DrawingApiBox>
                        <ModalText>AI가 재해석한 하루님의 그림 어떠신가요?</ModalText>
                    </Modal>
                </ModalOverlay>
            )}

            {showTextModal && (
                <ModalOverlay>
                    <Modal>
                        <CloseButton onClick={() => setShowTextModal(false)}>×</CloseButton>
                        <ModalTitle>오늘 하루도 고생 많았어요</ModalTitle>
                        <ModalTextBox>
                            {apiText}
                        </ModalTextBox>
                        <ModalText>AI가 재해석한 하루님의 하루 어떠신가요?</ModalText>
                    </Modal>
                </ModalOverlay>
            )}

            {showAuthModal && (
                <ModalOverlay>
                    <Modal>
                        <CloseButton onClick={() => {
                            setShowAuthModal(false);
                            setShowPasswordError(false);
                        }}>×</CloseButton>
                        <ModalTitle>AI와 함께하는 로그는 작성자만 볼 수 있어요</ModalTitle>
                        <ModalDescription>
                            하루로그는 일상의 평범함을 더욱 즐겁게 만들기 위해 여러분과 함께합니다
                        </ModalDescription>
                        <AuthInputGroup>
                            <AuthInputLabel>작성자</AuthInputLabel>
                            <AuthInput 
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                placeholder="작성자를 작성해주세요"
                                isError={showPasswordError}
                            />
                        </AuthInputGroup>
                        <AuthInputGroup>
                            <AuthInputLabel>비밀번호</AuthInputLabel>
                            <div style={{ position: 'relative' }}>
                                <AuthInput 
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={handlePasswordChange}
                                    placeholder="로그의 비밀번호를 설정해주세요 (영문, 숫자 무관 4자리 이상)"
                                    minLength={4}
                                    maxLength={20}
                                    isError={!isPasswordValid || showPasswordError}
                                />
                                <EyeIcon onClick={handleShowPassword}>
                                    {showPassword ? <img src={ShowEye} alt="비밀번호 숨기기" /> : <img src={hideEye} alt="비밀번호 보기" />}
                                </EyeIcon>
                            </div>
                            {!isPasswordValid && (
                                <ErrorMessage>비밀번호는 4자리 이상이어야 합니다.</ErrorMessage>
                            )}
                            {showPasswordError && (
                                <ErrorMessage>작성자 또는 비밀번호가 일치하지 않습니다.</ErrorMessage>
                            )}
                        </AuthInputGroup>
                        <ButtonGroup>
                            <CancelButton onClick={() => {
                                setShowAuthModal(false);
                                setShowPasswordError(false);
                            }}>
                                작성자가 아니에요
                            </CancelButton>
                            <SubmitButton onClick={handleAuthSubmit}>
                                AI와 함께한 로그 확인하기
                            </SubmitButton>
                        </ButtonGroup>
                    </Modal>
                </ModalOverlay>
            )}
        </Container>
    );
};

// Styled Components
const Container = styled.div`
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    background: #FEFFFB;
    min-height: 100vh;
    padding: 24px;
`;

const Content = styled.div`
    width: 880px;
    flex-direction: column;
    gap: 24px;
    margin-top: 24px;
`;

const DrawingBox = styled.div`
    width: 880px;
    background: white;
    border-radius: 12px;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.4);
    min-height: 154px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 24px;
`;

const TextBox = styled.div`
    width: 880px;
    background: white;
    border-radius: 12px;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.4);
    position: relative;
`;

const EditButton = styled.button`
    position: absolute;
    bottom: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    
    img {
        width: 100%;
        height: 100%;
    }
    
    &:hover {
        opacity: 0.8;
    }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    position: relative;
`;

const AuthorSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
`;

const CategoryAndDate = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const CategoryLabel = styled.div`
    display: flex;
    padding: 4px 8px;
    align-items: center;
    gap: 4px;
    background: #FBFFEE;
    border-radius: 4px;
    font-size: 12px;
    color: #333;
    height: 32px;
    
    img {
        width: 32px;
        height: 32px;
    }
`;

const Author = styled.div`
    font-size: 14px;
    color: #333;
`;

const Date = styled.div`
    color: #666;
    font-size: 14px;
`;

const DrawingImage = styled.img`
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
`;

const DrawingApiBox = styled.div`
    width: 578px;
    height: 253px;
    border: 1px solid #DDDDDD;
    border-radius: 4px;
    padding: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #333;
`;

const TextContent = styled.div`
    font-family: "UhBee Seulvely", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #333;
    min-height: 200px;
    white-space: pre-wrap;
    padding: 24px;
`;

const ActionBar = styled.div`
    width: 100%;
    text-align: center;
    padding-top: 24px;
    border-top: 1px solid #EEE;
    min-height: 704px;
`;

const LikeCount = styled.div`
    font-size: 14px;
    color: #666;
    margin-bottom: 16px;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 16px;
`;

const WriteButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 201px;
    height: 40px;
    border-radius: 4px;
    background: white;
    border: 1px solid #DDD;
    cursor: pointer;
    font-family: Pretendard;
    font-size: 14px;
    gap: 8px;

    &:hover {
        background: #EADDFF;
    }
`;

const StyledUpButtonWrapper = styled.div`
    button {
        width: 201px !important;
        height: 40px !important;
        flex: none !important;
    }
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const Modal = styled.div`
    background: white;
    padding: 32px;
    border-radius: 12px;
    position: relative;
    width: 642px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
`;

const ModalTitle = styled.h2`
    font-size: 24px;
    color: #333;
    margin: 0;
`;

const ModalImage = styled.img`
    width: 336px;
    height: 240px;
    object-fit: contain;
`;

const ModalText = styled.p`
    font-size: 16px;
    color: #333;
    margin: 0;
    text-align: center;
`;

const ModalTextBox = styled.div`
    width: 578px;
    height: 253px;
    border: 1px solid #DDDDDD;
    border-radius: 4px;
    padding: 16px;
    font-family: "UhBee Seulvely", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #333;
    white-space: pre-wrap;
    overflow-y: auto;
`;

const ModalDescription = styled.p`
    font-size: 16px;
    color: #666;
    margin: 0;
    text-align: center;
`;

const AuthInputGroup = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 76px;
    position: relative;
`;

const AuthInputLabel = styled.label`
    font-size: 14px;
    color: #333;
`;

const ErrorMessage = styled.p`
    color: #FF4B4B;
    font-size: 12px;
    margin: 0;
    position: absolute;
    bottom: -32px;
    left: 0;
`;

const AuthInput = styled.input`
    width: 100%;
    height: 40px;
    padding: 8px 12px;
    border: 1px solid ${props => props.isError ? '#FF4B4B' : '#DDD'};
    border-radius: 4px;
    font-size: 14px;
    
    &::placeholder {
        color: #999;
    }
    
    &:focus {
        outline: none;
        border-color: ${props => props.isError ? '#FF4B4B' : '#7B7EF6'};
    }
`;

const ButtonGroup = styled.div`
    width: 100%;
    display: flex;
    gap: 12px;
    margin-top: 16px;
`;

const CancelButton = styled.button`
    flex: 1;
    height: 40px;
    border: 1px solid #DDD;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    font-size: 14px;
    
    &:hover {
        background: #f5f5f5;
    }
`;

const SubmitButton = styled.button`
    flex: 1;
    height: 40px;
    border: none;
    border-radius: 4px;
    background: #7B7EF6;
    color: white;
    cursor: pointer;
    font-size: 14px;
    
    &:hover {
        background: #6366F1;
    }
`;

const EyeIcon = styled.div`
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    
    img {
        width: 20px;
        height: 20px;
    }
`;

export default DailyDetailPage;