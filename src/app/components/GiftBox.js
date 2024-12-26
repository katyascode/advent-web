import React, {useState} from "react";
import Modal from 'react-bootstrap/Modal';
import { doc, updateDoc } from 'firebase/firestore';
import dayjs from 'dayjs';
import { db } from "@/firebase/config";
import GiftGame from "../components/GiftGame";

const GiftBox = ({ gift, userId, onGiftOpened }) => {
  const [showModal, setShowModal] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);

  const handleReceive = async () => {
    const docRef = doc(db, 'users', userId, 'gifts', gift.id);
    await updateDoc(docRef, { opened: true });
    onGiftOpened(gift.id);

    if (gift?.giftCard) {
      window.open(gift.giftCard, '_blank');
    }

    setShowModal(false);
  }

  const getDate = (date) => {
    return new Date(date.toDate()).toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  const getTitle = (gift) => {
    if (gift?.game) {
      if (!isGameComplete) return "Solve the puzzle to receive your gift!";
    }
    return `You received ${gift?.title}!`;
  }

  const buttonTitle = (opened, date) => {
    if (opened) return "Gift opened! Click to view."
    else if (dayjs() < dayjs(date.toDate())) return "Not yet! 🎄"
    return "Open me! 🎁"
  }

  const buttonClassName = (opened, date) => {
    if (opened) return "bg-[#b2cfb9] text-white";
    else if (new Date() < new Date(date.toDate())) return "bg-gray-300 text-gray-500";
    return "bg-gradient-to-tr to-[#019D91] from-[#91c9c5] text-white animate-shake-rotate";
  }

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton className="border-b-white">
          <Modal.Title className="font-semibold">{getTitle(gift)}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="flex flex-col items-center justify-center space-y-3">
          {/* If the gift has an associated game, render it */}
          {gift?.game && !gift?.opened && (
            <GiftGame
              onGameComplete={() => setIsGameComplete(true)}
              isGameComplete={isGameComplete}
            />
          )}
          {/* Conditionally render photo & message */}
          {((!gift?.game) || (gift?.game && isGameComplete) || gift?.opened) && (
            <div className="px-4 text-center">
              <img src={gift?.photo} alt="Gift image" className="w-full mx-auto py-2 mb-2" />
              <p>{gift?.message}</p>
            </div>
          )}
        </Modal.Body>
        {/* If gift is unopened, display a button allowing the user to receive it. */}
        {(!gift?.opened || gift?.giftCard) && (!gift?.game || (gift?.game && isGameComplete)) && (
          <Modal.Footer className="mx-auto">
            <button
              className="p-2 bg-gradient-to-tr from-amber-200 to-amber-400 rounded-xl font-bold drop-shadow border-b-2 text-white text-sm"
              onClick={handleReceive}
            >
              {(gift?.opened && gift?.giftCard) ? "View gift card" : "Receive gift"}
            </button>
        </Modal.Footer>)}
      </Modal>
      <div key={gift?.id} className="flex flex-col p-3 justify-center items-center bg-white sm:w-1/3 w-2/3 rounded-xl shadow-lg">
        <div
          className={dayjs(gift?.date?.toDate()).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
            ? `flex flex-row bg-red-400 rounded text-white text-sm w-fit px-2 py-1 font-semibold justify-center`
            : `bg-gray-300 rounded text-white text-sm w-fit px-2 py-1 font-semibold`}
        >
          {getDate(gift?.date)}
        </div>
        <div className="flex flex-col space-y-3 h-full items-center justify-center">
          <p className="pt-3">{gift?.description}</p>
          <button
            className={`p-3 rounded-xl font-bold drop-shadow border-b-2 ${buttonClassName(gift?.opened, gift?.date)}`}
            onClick={() => handleOpen()}
            disabled={dayjs() < (dayjs(gift?.date.toDate()))}
          >
            {buttonTitle(gift?.opened, gift?.date)}
          </button>
        </div>
      </div>
    </>
  );
}

export default GiftBox;
