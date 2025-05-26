import { useState, useEffect } from 'react';
import { X, Calendar, Save, Loader, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface EditEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registrationRequired: boolean;
  imageUrl?: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  registrations: number;
  capacity: number;
  image?: string;
}

interface EditEventModalProps {
  isOpen: boolean;
  event: Event | null;
  onClose: () => void;
  onSave: (eventId: string, eventData: EditEventData) => Promise<void>;
}

const EditEventModal = ({ isOpen, event, onClose, onSave }: EditEventModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState<number>(50);
  const [registrationRequired, setRegistrationRequired] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Populate form when event changes
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');

      // Convert date back to input format
      const eventDate = new Date(event.date);
      setDate(eventDate.toISOString().split('T')[0]);

      // Handle time - extract time from time string
      const timeMatch = event.time.match(/(\d{2}):(\d{2})/);
      if (timeMatch) {
        setTime(`${timeMatch[1]}:${timeMatch[2]}`);
      }

      setLocation(event.location);
      setCapacity(event.capacity);
      setRegistrationRequired(false); // We don't have this info in the event object
      setCurrentImageUrl(event.image || '');
      setImagePreview('');
      setImage(null);
    }
  }, [event]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setLocation('');
    setCapacity(50);
    setRegistrationRequired(false);
    setImage(null);
    setImagePreview('');
    setCurrentImageUrl('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'events');

    const response = await fetch('https://jeetix-file-service.onrender.com/api/storage/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.data.fileUrl;
  };

  const handleSave = async () => {
    if (!event || !title.trim() || !date || !time || !location.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      let imageUrl = currentImageUrl;

      // Upload new image if selected
      if (image) {
        setIsUploadingImage(true);
        imageUrl = await uploadImage(image);
        setIsUploadingImage(false);
      }

      // Format the date and time according to API requirements
      const eventDate = new Date(date).toISOString();
      const eventTime = new Date(`${date}T${time}:00.000Z`).toISOString();

      const eventData: EditEventData = {
        title,
        description,
        date: eventDate,
        time: eventTime,
        location,
        capacity,
        registrationRequired,
        imageUrl,
      };

      await onSave(event.id, eventData);
      toast.success('Event updated successfully');
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to update event:', error);
      toast.error('Failed to update event. Please try again.');
      setIsUploadingImage(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      resetForm();
      onClose();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/*==================== Background Overlay ====================*/}
          <motion.div
            onClick={handleClose}
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          {/*==================== End of Background Overlay ====================*/}

          {/*==================== Modal Content ====================*/}
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 300,
              duration: 0.3,
            }}
          >
            <div className="relative p-6">
              {/*==================== Modal Header ====================*/}
              <div className="mb-5 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium flex items-center">
                    <span className="text-blue-700 mr-2">Edit</span>
                    <span className="text-amber-500">Event</span>
                    <span className="ml-3 relative">
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                      </span>
                    </span>
                  </h3>
                </div>

                <button
                  type="button"
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 disabled:opacity-50"
                  onClick={handleClose}
                  disabled={isSaving}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/*==================== End of Modal Header ====================*/}

              {/*==================== Form Content ====================*/}
              <div className="mb-6">
                {/*==================== Title ====================*/}
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter event title..."
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
                {/*==================== End of Title ====================*/}

                {/*==================== Description ====================*/}
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    rows={3}
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your event..."
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
                {/*==================== End of Description ====================*/}

                {/*==================== Date and Time Container ====================*/}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/*==================== Date ====================*/}
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>
                  {/*==================== End of Date ====================*/}

                  {/*==================== Time ====================*/}
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>
                  {/*==================== End of Time ====================*/}
                </div>
                {/*==================== End of Date and Time Container ====================*/}

                {/*==================== Location ====================*/}
                <div className="mb-4">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Lab 302, Virtual (Zoom), Main Auditorium"
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
                {/*==================== End of Location ====================*/}

                {/*==================== Capacity and Registration Container ====================*/}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/*==================== Capacity ====================*/}
                  <div>
                    <label
                      htmlFor="capacity"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Capacity
                    </label>
                    <input
                      id="capacity"
                      type="number"
                      min="1"
                      value={capacity}
                      onChange={(e) => setCapacity(parseInt(e.target.value) || 50)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>
                  {/*==================== End of Capacity ====================*/}

                  {/*==================== Registration Required Checkbox ====================*/}
                  <div className="flex items-center justify-center">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={registrationRequired}
                        onChange={(e) => setRegistrationRequired(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Registration Required
                      </span>
                    </label>
                  </div>
                  {/*==================== End of Registration Required Checkbox ====================*/}
                </div>
                {/*==================== End of Capacity and Registration Container ====================*/}

                {/*==================== Image Upload ====================*/}
                <div className="mb-4">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Flyer (Optional - leave blank to keep current)
                  </label>

                  {/* Show current image if exists */}
                  {currentImageUrl && !imagePreview && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Current Image:</p>
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={currentImageUrl}
                          alt="Current event flyer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <input
                      id="image"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        {image ? image.name : 'Click to upload new event flyer or drag & drop'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WebP (max 5MB)</p>
                    </div>
                  </div>

                  {/* New Image Preview */}
                  {imagePreview && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">New Image Preview:</p>
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={imagePreview}
                          alt="New event flyer preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
                {/*==================== End of Image Upload ====================*/}
              </div>
              {/*==================== End of Form Content ====================*/}

              {/*==================== Action Buttons ====================*/}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSaving}
                  className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || !title.trim() || !date || !time || !location.trim()}
                  className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      {isUploadingImage ? 'Uploading Flyer...' : 'Updating...'}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Event
                    </>
                  )}
                </button>
              </div>
              {/*==================== End of Action Buttons ====================*/}
            </div>
          </motion.div>
          {/*==================== End of Modal Content ====================*/}
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditEventModal;
