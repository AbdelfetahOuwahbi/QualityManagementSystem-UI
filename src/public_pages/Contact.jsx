import { useState } from "react";
import { Button, Checkbox, Label, Modal, TextInput, Textarea } from "flowbite-react";

export default function Contact({ onClose }) {

  const [consultantDetails, setConsultantDetails] = useState([
    {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      message: ""
    }
  ]);
  return (
    <>
      <Modal show={true} size="lg" onClose={onClose} popup>
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
                required
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
                required
              />

              <div className="mb-2 block">
                <Label htmlFor="email" value="email" />
              </div>
              <TextInput
                id="email"
                placeholder="exemple@gmail.com"
                value={consultantDetails[0].email}
                onChange={(event) => setConsultantDetails([
                  {
                    ...consultantDetails[0],
                    email: event.target.value
                  }
                ])}
                required
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
                required
              />
            </div>
            {/* Consultant Details Section Starts */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="message" value="message" />
              </div>
              <Textarea id="message" type="text" value={consultantDetails[0].message} onChange={(Event) => setConsultantDetails([
                  {
                    ...consultantDetails[0],
                    message: Event.target.value
                  }
                ])} required />
            </div>
            <div className="w-full">
              <Button onClick={() => console.log("details --> ", consultantDetails)}>Envoyer</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
