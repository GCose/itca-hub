import React from 'react';
import { motion } from 'framer-motion';
import AuthButton from '../auth-button';
import { Mail, User } from 'lucide-react';
import { RegistrationFormData } from '@/types/interfaces/auth';

interface PersonalInfoStepProps {
  formData: RegistrationFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContinue: () => void;
}

const PersonalInfoStep = ({ formData, onChange, onContinue }: PersonalInfoStepProps) => {
  return (
    <motion.div
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 1 }}
      animate={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: 70 }}
    >
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              required
              type="text"
              id="firstName"
              name="firstName"
              placeholder="John"
              onChange={onChange}
              value={formData.firstName}
              className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            required
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Doe"
            onChange={onChange}
            value={formData.lastName}
            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="schoolEmail" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            required
            id="schoolEmail"
            name="schoolEmail"
            type="email"
            onChange={onChange}
            value={formData.schoolEmail}
            placeholder="your.email@utg.edu.gm"
            className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <AuthButton type="button" onClick={onContinue}>
        Continue
      </AuthButton>
    </motion.div>
  );
};

export default PersonalInfoStep;
