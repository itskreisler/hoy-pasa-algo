import React, { useState } from 'react';
import { eventService } from '../services/eventService';
import Button from './Button';
import Input from './Input';
import { formsText } from '../constants/forms';

const CreateEventForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent = {
      title,
      description,
      date,
      category,
      image,
    };
    eventService.createEvent(newEvent);
    window.location.href = '/explore';
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="title">
          {formsText.titleLabel}
        </label>
        <Input
          type="text"
          placeholder={formsText.titlePlaceholder}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="description">
          {formsText.descriptionLabel}
        </label>
        <Input
          type="text"
          placeholder={formsText.descriptionPlaceholder}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="date">
          {formsText.dateLabel}
        </label>
        <Input
          type="date"
          placeholder={formsText.datePlaceholder}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="category">
          {formsText.categoryLabel}
        </label>
        <Input
          type="text"
          placeholder={formsText.categoryPlaceholder}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="image">
          {formsText.imageLabel}
        </label>
        <Input
          type="text"
          placeholder={formsText.imagePlaceholder}
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <Button type="submit">
          {formsText.createEventButton}
        </Button>
      </div>
    </form>
  );
};

export default CreateEventForm;
