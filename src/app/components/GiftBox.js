import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { doc, updateDoc } from 'firebase/firestore';
import dayjs from 'dayjs';
import { db } from "@/firebase/config";
import GiftGame from "../components/GiftGame";

const GiftBox = ({ gift, userId, onGiftOpened }) => {
  const [showModal, setShowModal] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(gift?.isGameCompleted || false);

  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);

  const handleGameComplete = async () => {
    const docRef = doc(db, 'users', userId, 'gifts', gift.id);
    await updateDoc(docRef, { isGameCompleted: true });
    setIsGameComplete(true);
  };

  const handleReceive = async () => {
    const docRef = doc(db, 'users', userId, 'gifts', gift.id);

    if (gift?.giftCard) {
      window.open(gift.giftCard, '_blank');
    }

    await updateDoc(docRef, { opened: true });
    onGiftOpened(gift.id);
    setShowModal(false);
  };

  const getDate = (date) => {
    return new Date(date.toDate()).toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTitle = (gift) => {
    if (gift?.game && !isGameComplete) {
      return "Solve the puzzle to receive your gift!";
    }
    return `You received ${gift?.title}!`;
  };

  const buttonTitle = (opened, date) => {
    if (opened) return "Gift opened! Click to view.";
    else if (dayjs() < dayjs(date.toDate())) return "Not yet! 🎄";
    return "Open me! 🎁";
  };

  const buttonClassName = (opened, date) => {
    if (opened) return "bg-[#b2cfb9] text-white";
    else if (new Date() < new Date(date.toDate())) return "bg-gray-300 text-gray-500";
    return "bg-gradient-to-tr to-[#019D91] from-[#91c9c5] text-white animate-shake-rotate";
  };

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton className="border-b-white">
          <Modal.Title className="font-semibold">{getTitle(gift)}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="flex flex-col items-center justify-center space-y-3">
          {/* If the gift has an associated game AND it's not opened AND puzzle not yet complete */}
          {gift?.game && !gift?.opened && !isGameComplete && (
            <GiftGame
              onGameComplete={handleGameComplete}
              isGameComplete={isGameComplete}
            />
          )}

          {/*
            If there is no game, OR there's a game but it's complete, OR the gift is already opened,
            then show the photo and message.
          */}
          {((!gift?.game) || (gift?.game && isGameComplete) || gift?.opened) && (
            <div className="flex flex-col space-y-2 px-4 text-center items-center">
              <img src={gift?.photo} alt="Gift" className="w-full mx-auto py-2 mb-2" />
              <p>{gift?.message}</p>
              {gift?.giftCardPin && gift?.giftCardNumber && (
                <>
                  <p className="text-sm font-semibold">Card number:</p>
                  <code className="rounded-lg bg-gray-100 p-2 w-fit">{gift?.giftCardNumber}</code>
                  <p className="text-sm font-semibold">PIN:</p>
                  <code className="rounded-lg bg-gray-100 p-2 w-fit">{gift?.giftCardPin}</code>
                </>
              )}
            </div>
          )}
        </Modal.Body>

        {/*
          Footer logic:
          Show the button area if there's no game, or if the game is completed, or if the gift is opened.
          This ensures the puzzle must be completed first before "Receive gift" can appear.
        */}
        {((!gift?.game) || isGameComplete || gift?.opened) && (
          <Modal.Footer className="mx-auto">
            {/* If gift is NOT opened, and EITHER there's no game OR game is complete, then "Receive gift" */}
            {(!gift?.opened && (!gift?.game || isGameComplete)) && (
              <button
                className="p-2 bg-gradient-to-tr from-amber-200 to-amber-400 rounded-xl font-bold drop-shadow border-b-2 text-white text-sm"
                onClick={handleReceive}
              >
                Receive gift
              </button>
            )}

            {/* If gift is already opened and it has a gift card => "View gift card" */}
            {(gift?.opened && gift?.giftCard) && (
              <button
                className="p-2 bg-gradient-to-tr from-amber-200 to-amber-400 rounded-xl font-bold drop-shadow border-b-2 text-white text-sm"
                onClick={handleReceive}
              >
                View gift card
              </button>
            )}

            {/* If gift is opened and there's no gift card => disabled "Gift received" */}
            {(gift?.opened && !gift?.giftCard) && (
              <button
                disabled
                className="p-2 bg-gray-300 rounded-xl font-bold drop-shadow border-b-2 text-gray-500 text-sm"
              >
                Gift received
              </button>
            )}
          </Modal.Footer>
        )}
      </Modal>

      <div
        key={gift?.id}
        className="flex flex-col p-3 justify-center items-center bg-white sm:w-1/3 w-2/3 rounded-xl shadow-lg"
      >
        <div
          className={
            dayjs(gift?.date?.toDate()).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
              ? `flex flex-row bg-red-400 rounded text-white text-sm w-fit px-2 py-1 font-semibold justify-center`
              : `bg-gray-300 rounded text-white text-sm w-fit px-2 py-1 font-semibold`
          }
        >
          {getDate(gift?.date)}
        </div>
        <div className="flex flex-col space-y-3 h-full items-center justify-center">
          <p className="pt-3">{gift?.description}</p>
          <button
            className={`p-3 rounded-xl font-bold drop-shadow border-b-2 ${buttonClassName(gift?.opened, gift?.date)}`}
            onClick={handleOpen}
            disabled={dayjs() < dayjs(gift?.date.toDate())}
          >
            {buttonTitle(gift?.opened, gift?.date)}
          </button>
        </div>
      </div>
    </>
  );
};

export default GiftBox;
