import axios from 'axios';
import {useMemo, useState} from 'react';
import { useModal } from "src/components/hooks/use-modal";
import "./css/SettingsModal.css";
import {decodeJwt} from "src/lib/tokenUtils";
import {useUrlQuery} from "src/components/hooks/use-url-query";

const SettingsModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [newServerName, setNewServerName] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [invitedUser, setInvitedUser] = useState('');
  const [resignUser, setReSignUser] = useState('');
  const accessToken = localStorage.getItem("accessToken");
  const userInfo = useMemo(() => decodeJwt(accessToken), [accessToken]);
  const userId = userInfo.sub;
  const query = useUrlQuery();
  const serverId = query.get("server");

  const isModalOpen = isOpen && type === "settings";


  const handleServerNameChange = (e) => {
    setNewServerName(e.target.value);
  };

  const handleImgChange = (e) => {
    setImgFile(e.target.files[0]);
  };


  const handleSaveSettings = async () => {
    const formData = new FormData();
    if (newServerName) formData.append('serverName', newServerName);
    if (imgFile) formData.append('imgFile', imgFile);
    if (invitedUser) formData.append('invitedUser', invitedUser);
    if (resignUser) formData.append('resignUser', resignUser);
    if (serverId) formData.append("serverId", serverId)
    if (userId) formData.append("userId", userId)

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/server/setting?id=${serverId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData
      });
    } catch (error) {
      console.error('서버 수정 실패:', error);
    }
    resetForm();
    onClose();
  };

  // const handleDelete = async () => {
  //   try {
  //     const response = await axios.delete(`${process.env.REACT_APP_API_URL}/server/delete?id=${serverId}&userId=${userId}`);
  //     onClose();
  //   } catch (error) {
  //     console.error('서버 삭제 실패:', error);
  //   }
  // };

  const resetForm = () => {
    setNewServerName('');
    setImgFile('');
    setInvitedUser('');
    setReSignUser('');
  };

  const modalStyle = {
    display: isModalOpen ? 'block' : 'none',
  };

  return (
      <div className="modal" style={modalStyle}>
        <div className="modal-content">
          <label>
            새로운 서버 이름:
            <input type="text" value={newServerName} onChange={handleServerNameChange} />
          </label>

          <div className="button-container">
            {/*<button onClick={handleDelete} >서버삭제</button>*/}
            <button onClick={handleSaveSettings}>저장</button>
            <button onClick={onClose}>취소</button>
          </div>
        </div>

      </div>
  );
};

export default SettingsModal;
