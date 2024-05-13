import { useState } from "react";
import { Button, Checkbox, Label, Modal, TextInput, Textarea } from "flowbite-react";
import { Toaster, toast } from "react-hot-toast";
import { serverAddress } from "../ServerAddress";

export default function Contact({ onClose }) {

  const [openModal, setOpenModal] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [consultantDetails, setConsultantDetails] = useState([
    {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      organisation: ""
    }
  ]);

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setConsultantDetails([{ ...consultantDetails[0], email: newEmail }]);
    if (!validateEmail(newEmail)) {
      setEmailError(`Format d'email ${newEmail} est invalid`);
    } else {
      setEmailError('');
    }
  };

  async function handleContactUs(first_name, last_name, email, phone, organisation) {
    if (emailError !== '') {
      toast.error(emailError);
    } else if (first_name !== "" && last_name !== "" && email !== "" && phone !== "" && organisation !== "") {
      try {

        const response = await fetch(`http://${serverAddress}:8080/api/v1/notification/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'senderId': "newlyJoining",
            'receiverId': "SysAdmin",
            'message': `Un consultant SMQ répondant au nom : ${first_name}, prenom : ${last_name}, et dont l'adresse e-mail est : ${email}, et le numéro de téléphone : ${phone}, il est dans l'organisation : ${organisation} a demandé la création d'un compte`
          }),
        });

        if (response.status === 200 || response.status === 201) {
          toast.success('votre message est envoyé avec succès..');
          setTimeout(() => {
            setOpenModal(false);
          }, 2000);
        }

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error sending contact message:', error);
        toast.error('Une erreur s\'est produite lors de l\'envoi du message.');
      }
    } else {
      toast.error("n'a pas passer !!")
      toast(
        "vous devez fournir tous les informations",
        {
          duration: 6000,
        }
      );
    }
  }

  return (
    <>
      <Toaster
        position="bottom-left"
        reverseOrder={false}
      />
      <Modal show={openModal} size="lg" onClose={onClose} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white"> Envoyer les details de votre organisation</h3>

            {/* Consultant Details Section Starts */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="prénom" value="prénom" />
              </div>
              <TextInput
                id="first_name"
                placeholder="votre prénom"
                value={consultantDetails[0].first_name}
                onChange={(event) => setConsultantDetails([
                  {
                    ...consultantDetails[0],
                    first_name: event.target.value
                  }
                ])}
              />

              <div className="mb-2 block">
                <Label htmlFor="nom" value="nom" />
              </div>
              <TextInput
                id="last_name"
                placeholder="votre nom"
                value={consultantDetails[0].last_name}
                onChange={(event) => setConsultantDetails([
                  {
                    ...consultantDetails[0],
                    last_name: event.target.value
                  }
                ])}

              />

              <div className="mb-2 block">
                <Label htmlFor="email" value="email" />
              </div>
              <TextInput
                id="email"
                placeholder="exemple@gmail.com"
                value={consultantDetails[0].email}
                onChange={handleEmailChange}

              />

              <div className="mb-2 block">
                <Label htmlFor="phone" value="Téléphone" />
              </div>
              <TextInput
                id="phone"
                placeholder="06********"
                value={consultantDetails[0].phone}
                onChange={(event) => setConsultantDetails([
                  {
                    ...consultantDetails[0],
                    phone: event.target.value
                  }
                ])}

              />
            </div>
            {/* Consultant Details Section Starts */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="organisation" value="nom de votre organisation" />
              </div>
              <TextInput id="organisation" type="text" value={consultantDetails[0].organisation}
                placeholder="Organisation"
                onChange={(Event) => setConsultantDetails([
                  {
                    ...consultantDetails[0],
                    organisation: Event.target.value
                  }
                ])} />
            </div>
            <div className="w-full">
              <Button onClick={() => handleContactUs(
                consultantDetails[0].first_name,
                consultantDetails[0].last_name,
                consultantDetails[0].email,
                consultantDetails[0].phone,
                consultantDetails[0].organisation
              )}>Envoyer</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
