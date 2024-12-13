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

const MessagesModal = ({
    isMessagesModalOpen,
    toggleMessagesModal,
    user,
    adminMessageInput,
    setAdminMessageInput,
    messagesList,
    openReplyModal,
    handleDeleteMessage,

    }
) => {
    const [adminMessageSelectedRole, setAdminMessageSelectedRole] = useState('')
    const [adminMessageSelectedUser, setAdminMessageSelectedUser] = useState({})
    const [roleUsers, setRoleUsers] = useState([]);
    const roles = ["doctor", "attendant", "registar", "rediologist", "laboratorist", "patient"]

    const handleAdminMessageSend = async () => {
        const payload = {
          type : "admin",
          role : adminMessageSelectedRole,
          username : adminMessageSelectedUser.username,
          userId : adminMessageSelectedUser._id,
          message : adminMessageInput
        }
        console.log("payload  " , payload)
        await axios.post("http://localhost:5000/adminmessage/addmessage", payload)
        .then((res) => {
          console.log(res.data.message)
        })
        setAdminMessageSelectedRole('')
        setRoleUsers([])
        setAdminMessageSelectedUser({})
        setAdminMessageInput('')
        toggleMessagesModal()
      }

    const fetchRoleUsers = async (role) => {
      await axios.get(`http://localhost:5000/auth/getroleusers/${role}`)
      .then( (res) => {
        setRoleUsers(res.data.result)
        console.log(roleUsers)
      })
      .catch((e)=>{
        console.log(e.message)
      })
    } 
    

    return (
        <Modal isOpen={isMessagesModalOpen} onClose={toggleMessagesModal}>
        {user.role === "admin"? 
          <ModalContent>
            <ModalHeader>Messages</ModalHeader>
            <ModalBody>
              {/* Role select dropdown */}
              <label htmlFor="roleDropdown" style={{ display: "block", fontStyle: "italic", fontWeight:"bolder"}}>
                Select a Role:
              </label>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered" className="capitalize">
                    {adminMessageSelectedRole ? adminMessageSelectedRole : "Select Role"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Select a Role"
                  variant="flat"
                  selectionMode="single"
                  selectedKeys={[adminMessageSelectedRole]}
                  onSelectionChange={(key) => {
                    const selectedRole = [...key][0]; 
                    setAdminMessageSelectedRole(selectedRole);
                    setAdminMessageSelectedUser("");
                    setRoleUsers([]);
                    fetchRoleUsers(selectedRole);
                  }}
                >
                  {roles.map((role) => (
                    <DropdownItem key={role}>{role}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              {/* Users select dropdown */}
              <label htmlFor="userDropdown" style={{ display: "block", fontStyle: "italic", fontWeight:"bolder"}}>
                Select a User:
              </label>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="bordered"
                    className="capitalize"
                    disabled={roleUsers.length === 0}
                  >
                    {adminMessageSelectedUser?.username
                      ? adminMessageSelectedUser.username
                      : "Select User"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Select a User"
                  variant="flat"
                  selectionMode="single"
                  onSelectionChange={(key) => {
                    const selectedUser = roleUsers.find((user) => user._id === [...key][0]); 
                    if (selectedUser) {
                      setAdminMessageSelectedUser(selectedUser); 
                    }
                  }}
                >
                  {roleUsers.map((user) => (
                    <DropdownItem key={user._id}>{user.username}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <label htmlFor="messageInput" style={{ display: "block", fontStyle: "italic", fontWeight:"bolder"}}>
                Enter The Message:
              </label>
              <Input
                placeholder="Enter your message"
                fullWidth
                value={adminMessageInput}
                onChange={(e) => {setAdminMessageInput(e.target.value);}}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={()=>{
                if (!adminMessageSelectedRole || Object.keys(adminMessageSelectedUser).length === 0 || !adminMessageInput) {
                  return
                }
                handleAdminMessageSend()
              }}>
                Send
              </Button>
            </ModalFooter>
          </ModalContent>
          
          :
          <ModalContent>
            <ModalHeader>Messages</ModalHeader>
            <ModalBody>
              <Card style={{ backgroundColor: "#d4eeef" }}>
                {messagesList.map((message, index) => (
                  <CardBody key={index} className="flex justify-between items-center">
                    <div style={{display:"flex", flexDirection:"row"}}>
                      <div>
                        <h4 style={{ fontWeight: "bolder", textAlign: "center" }}>{message.name}</h4>
                        <h3>{message.message}</h3>
                      </div>
                      <div className="flex items-center">
                        {user.role === "doctor" && message.name != "Admin" ? (
                          <Button color="primary" onPress={() => openReplyModal(message)}>
                            Reply
                          </Button>
                        ) : message.name === "Admin"? (
                          <Button color="primary" onPress={() => {
                            openReplyModal(message)
                            }}>
                            Reply
                          </Button>
                        ) : null}
                        <button
                          className="text-red-500 ml-4"
                          onClick={() => {handleDeleteMessage(message.id, message)}}
                        >
                          ✖
                        </button>
                      </div>
                    </div>
                  </CardBody>
                ))}
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={toggleMessagesModal}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>      
        }

      </Modal>
    )
}


export default MessagesModal;