import { useEffect, useState } from "react";
import { FaMessage, FaUserGear } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";
import { MdNotificationsActive } from "react-icons/md";
import axios from "axios";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  CardBody,
  Card,
  Input,
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem,
} from "@nextui-org/react";
import MessagesModal from "../modal/MessagesModal";
import NotificationsModal from "../modal/NotificationsModal";
import MessageModal from "../modal/MessageModal";
import ReplyModal from "../modal/ReplyModel";

const DashBordNav = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);

  const [user, setUser] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState("");

  const [docDetails, setDocDetails] = useState(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [nextClinicDate, setNextClinicDate] = useState("");

  const [messagesList, setMessagesList] = useState([]);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAMessageOpen, setIsAMessageOpen] = useState(false);
  const [notificationSelectedMessage, setNotificationSelectedMessage] = useState("");

  const [role, setRole] = useState('');

  //admin messaging

  const [adminMessageInput, setAdminMessageInput] = useState('')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem("authUser");
        if (!storedUser) {
          window.location.href = "/login";
          return;
        }
  
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setDocDetails(parsedUser);
        setRole(parsedUser.role);
  
        const messages = [];
  
        if (parsedUser.role === "admin") {
          const { data } = await axios.get(
            `http://localhost:5000/adminmessage/admingetreplies`
          );
          const adminReplies = data.result.map((reply) => ({
            toAdmin : "yes",
            id: reply._id,
            name: reply.username, 
            message: reply.message,
          }));
  
          messages.push(...adminReplies);
        } else {
          if (parsedUser.role === "doctor") {
            const { data } = await axios.get(
              `http://localhost:5000/appointment/request/${parsedUser._id}`
            );
            const requests = data.requests;
  
            const doctorMessages = await Promise.all(
              requests.map(async (request) => {
                const { data: patientData } = await axios.get(
                  `http://localhost:5000/patients/${request.patientId}`
                );
                const fullName = `${patientData.patient.firstName} ${patientData.patient.lastName}`;
                return {
                  id: request._id,
                  name: fullName,
                  message: request.reason,
                  patientId: request.patientId,
                };
              })
            );
  
            messages.push(...doctorMessages);
          } else if (parsedUser.role === "patient") {
            const { data } = await axios.get(
              `http://localhost:5000/appointment/reply/${parsedUser.email}`
            );
            const replies = data.replies;
  
            const patientMessages = await Promise.all(
              replies.map(async (reply) => {
                const { data: docData } = await axios.get(
                  `http://localhost:5000/auth/${reply.docId}`
                );
                return {
                  id: reply._id,
                  name: docData.user.username,
                  message: reply.reason,
                };
              })
            );
  
            messages.push(...patientMessages);
          }
  
          const adminResponse = await axios.get(
            `http://localhost:5000/adminmessage/getmessages/${parsedUser._id}`
          );
  
          if (adminResponse.data.message === "found") {
            const adminMessages = adminResponse.data.result.map((m) => ({
              name: "Admin",
              message: m.message,
              id: m._id,
            }));
  
            messages.push(...adminMessages);
          }
        }
  
        setMessagesList(messages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchUserData();
  }, []);

  
  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/admin/search/${idNumber}`);
      setSearchResult({
        type: response.data.type,
        details: response.data.data,
      });
      setError("");
      setIsModalOpen(true);
    } catch (error) {
      setError("No user found with this ID number.");
      setSearchResult(null);
      setIsModalOpen(false);
    }
  };

  const toggleMessagesModal = () => {
    setIsMessagesModalOpen(!isMessagesModalOpen);
  };

  const toggleAMessageModal = () => {
    setIsAMessageOpen(!isAMessageOpen);
  };

  const openReplyModal = (message) => {
    setSelectedMessage(message);
    setIsReplyModalOpen(true);
  };


  const closeReplyModal = () => {
    setIsReplyModalOpen(false);
    setNextClinicDate("");
  };

  const toggleNotificationModal = () => {
    setIsNotificationOpen(!isNotificationOpen);
  }

  const handleReplySubmit = async (message, replyMessage) => {
    if (message.name === "Admin") {
      const payload = {
        type : "reply",
        role : "admin",
        username : user.username,
        userId : "None",
        message : replyMessage
      }
      console.log("payload  " , payload)
      await axios.post("http://localhost:5000/adminmessage/addmessage", payload)
      .then((res) => {
        console.log(res.data.message)
      })
    }
    else {
      const date = new Date(nextClinicDate)
      const today = new Date()
      if ( date < today) {
        return 
      }
      
      const payload = {
        type: "reply",
        patientId: selectedMessage?.patientId,
        doctorId: user._id,
        reason: replyMessage,
      };

      axios.post("http://localhost:5000/appointment", payload).then((response) => {
        console.log(response.data);
      });
      
      // set next clinic date
      if (nextClinicDate != "") {
        const nextDatePayload = {
          patientId : selectedMessage?.patientId,
          dateIssuedBy : user.username,
          date : nextClinicDate,
          doctorId : user._id,
        }
        try {
          axios.post("http://localhost:5000/medical-record/nextDate", nextDatePayload).then( (response) => {
            console.log(response.data.message)
          })
        }catch (e) {
          console.log("not OK")
          console.log(e.message)
        }
      }
    }
    closeReplyModal();
    handleDeleteMessage(selectedMessage?.id, selectedMessage)
    setNotificationSelectedMessage("")
    setIsAMessageOpen(false)
  };

  const handleDeleteMessage = (messageId , message ) => {
    console.log("    something junk     ", message)
    if (message.name === "Admin" | message?.toAdmin === "yes"){
      axios.delete(`http://localhost:5000/adminmessage/deletemessage/${messageId}`)
      .then((res) => {
        console.log(res.data.message)
        setMessagesList((prevMessages) => 
          prevMessages.filter((msg) => msg.id !== messageId)
        );  
      })
    }else {
      axios
        .delete(`http://localhost:5000/appointment/${messageId}`)
        .then((response) => {
          console.log("Message deleted:", response.data);

          setMessagesList((prevMessages) =>
            prevMessages.filter((message) => message.id !== messageId)
          );
        })
        .catch((error) => {
          console.error("Error deleting message:", error);
        });
    }
  }; 


  return (
    <div>
      <nav className="bg-gray-200 p-2 rounded-lg">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              className="p-2 rounded-lg w-72 h-10"
              placeholder="Search by ID Number"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-2 py-1 rounded-lg h-10" onClick={handleSearch}>
              Search
            </button>
          </div>
          <div className="flex items-center justify-center gap-10">
            <div className="flex gap-2 items-center text-sm" onClick={toggleMessagesModal}>
              <FaMessage size={16} />
              Messages
            </div>
            <div className="flex gap-2 items-center text-sm" onClick={toggleNotificationModal}>
              {messagesList.length > 0 ?
                 <MdNotificationsActive size={20} style={{color:"red"}}/>
              :<IoIosNotifications size={20}/>}
              Notifications
            </div>
            <div className="flex items-center gap-5 p-1 px-4">
              <FaUserGear size={20} />
              <div>
                <h1 className="font-semibold">{user?.username}</h1>
                <h2 className="text-gray-700 text-sm">{user?.role}</h2>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {searchResult && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalContent>
            <ModalHeader>{searchResult.type === "patient" ? "Patient Details" : "Staff Member Details"}</ModalHeader>
            <ModalBody>
              <table className="table-auto w-full">
                <tbody>
                  {Object.keys(searchResult.details).map((key) => (
                    <tr key={key} className="border-b">
                      <td className="p-2 font-semibold text-gray-700 capitalize">{key}</td>
                      <td className="p-2 text-gray-600">{searchResult.details[key]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={() => setIsModalOpen(false)}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      <MessagesModal 
        isMessagesModalOpen={isMessagesModalOpen}
        toggleMessagesModal={toggleMessagesModal}
        user={user}
        setAdminMessageInput={setAdminMessageInput}
        adminMessageInput={adminMessageInput}
        messagesList={messagesList}
        openReplyModal={openReplyModal}
        handleDeleteMessage={handleDeleteMessage}

      />
      <NotificationsModal 
        isNotificationOpen={isNotificationOpen}
        toggleNotificationModal={toggleNotificationModal}
        toggleAMessageModal={toggleAMessageModal}
        messagesList={messagesList}
        setNotificationSelectedMessage={setNotificationSelectedMessage}
      />

      <MessageModal
        isAMessageOpen={isAMessageOpen}
        toggleAMessageModal={toggleAMessageModal}
        notificationSelectedMessage={notificationSelectedMessage}
        role={role}
        openReplyModal={openReplyModal}
        handleDeleteMessage={handleDeleteMessage}
      />

      {error && <div className="error-message text-red-500 mt-2">{error}</div>}
      
      <ReplyModal 
        isReplyModalOpen={isReplyModalOpen}
        closeReplyModal={closeReplyModal}
        selectedMessage={selectedMessage}
        nextClinicDate={nextClinicDate}
        setNextClinicDate={setNextClinicDate}
        handleReplySubmit={handleReplySubmit}
      />

    </div>
  );
};

export default DashBordNav;