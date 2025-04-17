import styled from '@emotion/styled';
import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  width: 100vw;
  padding: 16px;
  background-color: #f5f5f5;
  box-sizing: border-box;
  font-size: 14px;
`;

const PlannerContainer = styled.div`
  width: 100%;
  max-width: 900px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h1`
  color: #333;
  margin-bottom: 16px;
  font-size: 1.4em;
`;

const Section = styled.div`
  margin-bottom: 16px;
  
  h2 {
    color: #333;
    font-size: 1.1em;
    margin-bottom: 8px;
    padding-bottom: 4px;
    border-bottom: 2px solid #80CBC4;
  }
`;

const Schedule = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin-top: 10px;
  padding-right: 4px;
`;

const TimeSlot = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  height: 28px;
  margin-bottom: 3px;
  
  span {
    width: 50px;
    color: #666;
    font-size: 0.75em;
    text-align: right;
  }
`;

const TimeSlotContainer = styled.div`
  position: relative;
  height: 28px;
  background-color: #f9f9f9;
  border-radius: 4px;
  flex: 1;
  max-width: 350px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
  overflow: visible;
  box-sizing: border-box;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const TimeBlock = styled.div`
  position: absolute;
  left: ${props => props.startPercent}%;
  width: ${props => props.durationPercent}%;
  height: 80%;
  top: 10%;
  background-color: ${props => props.color || '#80CBC4'};
  border-radius: 4px;
  color: white;
  font-size: 11px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  z-index: 1;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-sizing: border-box;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 2;
  }

  input {
    width: calc(100% - 12px);
    background: transparent;
    border: none;
    color: white;
    font-size: 11px;
    padding: 0;
    margin: 0;
    outline: none;
  }
`;

const ResizeHandle = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: ew-resize;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0 4px 4px 0;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }
`;

const DurationIndicator = styled.div`
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 10px;
  white-space: nowrap;
  z-index: 3;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const EventControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 8px 0;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 6px;
  width: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ControlRow = styled.div`
  display: flex;
  gap: 6px;
  align-items: flex-start;
  width: 100%;
  flex-wrap: wrap;
`;

const ControlButton = styled.button`
  padding: 4px 10px;
  background-color: #80CBC4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  height: 28px;
  
  &:hover {
    background-color: #69b4ae;
  }
`;

const ActivitySelect = styled.select`
  padding: 5px 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 12px;
  width: 100%;
  max-width: 150px;
  margin-bottom: 2px;
  height: 28px;
  
  &:focus {
    outline: none;
    border-color: #80CBC4;
  }
`;

const TimeSelect = styled.select`
  padding: 5px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 11px;
  width: 52px;
  height: 28px;
  
  &:focus {
    outline: none;
    border-color: #80CBC4;
  }
`;

const TimeSelectContainer = styled.div`
  display: flex;
  gap: 3px;
  align-items: center;
`;

const DurationSelect = styled.select`
  padding: 5px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 11px;
  width: 52px;
  height: 28px;
  
  &:focus {
    outline: none;
    border-color: #80CBC4;
  }
`;

const CustomActivityInput = styled.input`
  padding: 6px 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 12px;
  width: 100%;
  margin-top: 6px;
  height: 28px;
  
  &:focus {
    outline: none;
    border-color: #80CBC4;
  }
`;

const SaveActivityCheckbox = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  margin: 0;
  height: 28px;
  
  input[type="checkbox"] {
    width: 14px;
    height: 14px;
    cursor: pointer;
  }
  
  label {
    font-size: 11px;
    color: #666;
    cursor: pointer;
  }
`;

const TodoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 450px;
  overflow-y: auto;
  padding-right: 8px;
`;

const TopItems = styled.div`
  background-color: #E0F2F1;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  h2 {
    font-size: 1.05em;
    margin-bottom: 6px;
    color: #333;
  }
`;

const TodoItem = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 4px 6px;
  border-radius: 4px;
  height: 28px;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.completed ? 'transparent' : '#f5f5f5'};
  }

  input[type="text"] {
    flex: 1;
    padding: 4px 6px;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    text-decoration: ${props => props.completed ? 'line-through' : 'none'};
    color: ${props => props.completed ? '#666' : 'inherit'};
    background-color: transparent;
    transition: all 0.2s;

    &.focused, &:focus {
      background-color: white;
      border: 1px solid #e0e0e0;
      outline: none;
      border-color: #80CBC4;
      box-shadow: 0 0 0 2px rgba(128, 203, 196, 0.2);
    }
    
    &:hover {
      background-color: white;
    }
  }

  button {
    padding: 3px 8px;
    background-color: ${props => props.completed ? '#9E9E9E' : '#80CBC4'};
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 11px;
    cursor: pointer;
    min-width: 50px;
    transition: all 0.2s;

    &:hover {
      background-color: ${props => props.completed ? '#757575' : '#69b4ae'};
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(250px, 55%) minmax(180px, 40%);
  gap: 16px;
  margin-bottom: 16px;
`;

const GratefulSection = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const GratefulInput = styled.textarea`
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  min-height: 60px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #80CBC4;
  }
`;

const GratefulDisplay = styled.div`
  font-size: 1em;
  color: #333;
  padding: 10px;
  line-height: 1.4;
  position: relative;

  .gratitude-label {
    font-family: 'Arial', sans-serif;
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
    text-align: center;
  }

  .gratitude-text {
    font-size: 1.1em;
    color: #666;
    text-align: center;
    margin-bottom: 15px;
  }

  .edit-button {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 4px 8px;
    background-color: #80CBC4;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
    &:hover {
      background-color: #69b4ae;
    }
  }
`;

const SubmitButton = styled.button`
  padding: 8px 16px;
  background-color: #80CBC4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #69b4ae;
  }
`;

const NotesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
`;

const NoteBox = styled.textarea`
  width: 100%;
  height: 80px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 10px;
  resize: none;
  font-size: 13px;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #80CBC4;
  }
`;

const AddNoteButton = styled.button`
  padding: 6px 12px;
  background-color: #80CBC4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  align-self: flex-start;
  margin-bottom: 16px;
  
  &:hover {
    background-color: #69b4ae;
  }
`;

const QuoteSection = styled.div`
  padding: 8px;
  margin: 2px 0 10px 0;
  font-style: italic;
  text-align: center;
  color: #333;

  .quote-text {
    font-size: 1em;
    margin-bottom: 4px;
    line-height: 1.3;
  }

  .quote-author {
    font-size: 0.85em;
    color: #666;
  }
`;

const DatePickerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
`;

const DatePicker = styled.input`
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #80CBC4;
  }
`;

const DateNavButton = styled.button`
  padding: 8px 16px;
  background-color: #80CBC4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 5px;
  
  &:hover {
    background-color: #69b4ae;
  }
`;

const DateNavContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const DateNavRow = styled.div`
  display: flex;
  align-items: center;
`;

const CalendarButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #80CBC4;
  font-size: 12px;
  padding: 2px;
  margin-top: 4px;
  
  &:hover {
    color: #69b4ae;
  }
`;

const ContextMenu = styled.div`
  position: fixed;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 1000;
  
  button {
    display: block;
    width: 100%;
    padding: 8px 16px;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    
    &:hover {
      background: #f5f5f5;
    }
  }
`;

// Add new styled components for the search functionality
const SearchBarContainer = styled.div`
  position: relative;
  width: 250px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 13px;
  
  &:focus {
    outline: none;
    border-color: #80CBC4;
    box-shadow: 0 0 0 2px rgba(128, 203, 196, 0.2);
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 0 0 4px 4px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const SearchResultItem = styled.div`
  padding: 10px 15px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  .date {
    font-weight: bold;
    color: #333;
  }
  
  .highlight {
    color: #80CBC4;
    font-weight: bold;
  }
  
  .match-info {
    color: #666;
    font-size: 0.9em;
  }
`;

// Todo object structure:
// {
//   id: string,
//   text: string,
//   completed: boolean
// }

// TimeEvent object structure:
// {
//   id: string,
//   title: string,
//   startTime: string,
//   duration: number,
//   color: string (optional),
//   isTemporary: boolean (optional)
// }

// NewEventState object structure:
// {
//   title: string,
//   startTime: string,
//   duration: number,
//   color: string (optional),
//   hour: string,
//   minute: string,
//   period: string
// }

// EventSpan object structure:
// {
//   event: TimeEvent,
//   startPercent: number,
//   durationPercent: number
// }

// TopItem object structure:
// {
//   id: string,
//   text: string,
//   completed: boolean
// }

// GratitudeState object structure:
// {
//   text: string,
//   submitted: boolean
// }

// Quote object structure:
// {
//   text: string,
//   author: string
// }

function App() {
  const initialHour = "9";
  const initialMinute = "00";
  const initialPeriod = "AM";
  const initialStartTime = `09:00`;

  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [contextMenu, setContextMenu] = useState(null);
  const [events, setEvents] = useState([]);
  const [todos, setTodos] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i.toString(),
      text: '',
      completed: false,
    }))
  );
  const [topItems, setTopItems] = useState(
    Array.from({ length: 5 }, (_, i) => ({
      id: i.toString(),
      text: '',
      completed: false,
    }))
  );
  const [gratitudeState, setGratitudeState] = useState({ text: '', submitted: false });
  const [notes, setNotes] = useState(['']);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [focusedTodoId, setFocusedTodoId] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    startTime: initialStartTime,
    duration: 30,
    color: '#80CBC4',
    hour: initialHour,
    minute: initialMinute,
    period: initialPeriod,
  });
  const [activities, setActivities] = useState([
    'Breakfast', 'Lunch', 'Dinner', 'Break', 'Write', 'Walk', 'Music', 'Work', 'Read',
  ]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customActivity, setCustomActivity] = useState('');
  const [saveCustomActivity, setSaveCustomActivity] = useState(false);
  const [showActivityManager, setShowActivityManager] = useState(false);
  const [newActivity, setNewActivity] = useState('');
  const [editingEventId, setEditingEventId] = useState(null);
  const [draggingEventId, setDraggingEventId] = useState(null);
  const [dragStartX, setDragStartX] = useState(null);
  const timeSlotRefs = useRef([]);

  // Add new state variables for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // This would normally come from a database - simulating stored data
  const [storedDays, setStoredDays] = useState({
    // Simulated data for demo purposes
    '2023-06-15': {
      gratitude: 'Family and friends',
      todos: [
        { text: 'Complete project proposal', completed: true },
        { text: 'Call dentist', completed: false },
      ],
      notes: ['Meeting notes from client call']
    },
    '2023-07-20': {
      gratitude: 'Good health and sunshine',
      todos: [
        { text: 'Buy groceries', completed: true },
        { text: 'Work on presentation', completed: true },
      ],
      notes: ['Ideas for new project', 'Call mom about weekend plans']
    },
    '2023-08-05': {
      gratitude: 'The opportunity to learn new things',
      todos: [
        { text: 'Schedule dentist appointment', completed: false },
        { text: 'Finish book chapter', completed: true },
      ],
      notes: ['Dental care reminder']
    }
  });

  const colors = [
    '#80CBC4', '#FF8A65', '#9575CD', '#4FC3F7', '#81C784',
    '#FFA726', '#F06292', '#7986CB', '#FFB74D', '#4DB6AC',
  ];

  const displayTimeSlots = Array.from({ length: 18 }, (_, i) => {
    const hour = i + 5;
    return {
      label: hour < 12 ? `${hour}:00 am` : hour === 12 ? `12:00 pm` : `${hour - 12}:00 pm`,
      value: `${hour.toString().padStart(2, '0')}:00`,
    };
  });

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));
  const periods = ['AM', 'PM'];

  const getUniqueColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const checkForOverlap = (startTime, duration, events, excludeId) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = startMinutes + duration;

    return events.some(event => {
      if (event.id === excludeId || event.isTemporary) return false;
      const [eventStartHour, eventStartMin] = event.startTime.split(':').map(Number);
      const eventStartMinutes = eventStartHour * 60 + eventStartMin;
      const eventEndMinutes = eventStartMinutes + event.duration;

      return (
        (startMinutes >= eventStartMinutes && startMinutes < eventEndMinutes) ||
        (endMinutes > eventStartMinutes && endMinutes <= eventEndMinutes) ||
        (startMinutes <= eventStartMinutes && endMinutes >= eventEndMinutes)
      );
    });
  };

  const handleTimeChange = (field, value) => {
    setNewEvent(prev => {
      const updated = { ...prev, [field]: value };
      const hour = field === 'hour' ? parseInt(value) : parseInt(prev.hour);
      const minute = field === 'minute' ? value : prev.minute;
      const period = field === 'period' ? value : prev.period;

      let hour24 = hour;
      if (period === 'PM' && hour !== 12) hour24 += 12;
      if (period === 'AM' && hour === 12) hour24 = 0;

      const startTime = `${hour24.toString().padStart(2, '0')}:${minute}`;
      return { ...updated, startTime };
    });
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.startTime) {
      alert('Please select an activity and time');
      return;
    }

    if (checkForOverlap(newEvent.startTime, newEvent.duration, events)) {
      alert('This event overlaps with an existing event');
      return;
    }

    const event = {
      id: uuidv4(),
      title: newEvent.title,
      startTime: newEvent.startTime,
      duration: newEvent.duration,
      color: newEvent.color || getUniqueColor(),
    };

    setEvents(prev => [...prev, event]);

    const resetHour = "9";
    const resetMinute = "00";
    const resetPeriod = "AM";
    const resetStartTime = `09:00`;

    setNewEvent({
      title: '',
      startTime: resetStartTime,
      duration: 30,
      color: getUniqueColor(),
      hour: resetHour,
      minute: resetMinute,
      period: resetPeriod,
    });

    setShowCustomInput(false);
    setCustomActivity('');
    setSaveCustomActivity(false);
  };

  const handleCustomActivitySubmit = () => {
    if (!customActivity.trim() || !newEvent.startTime) {
      alert('Please enter an activity name and select a time');
      return;
    }

    if (checkForOverlap(newEvent.startTime, newEvent.duration, events)) {
      alert('This event overlaps with an existing event');
      return;
    }

    if (saveCustomActivity) {
      setActivities(prev => [...prev, customActivity.trim()]);
    }

    const event = {
      id: uuidv4(),
      title: customActivity.trim(),
      startTime: newEvent.startTime,
      duration: newEvent.duration,
      color: newEvent.color || getUniqueColor(),
    };

    setEvents(prev => [...prev, event]);

    const resetHour = "9";
    const resetMinute = "00";
    const resetPeriod = "AM";
    const resetStartTime = `09:00`;

    setNewEvent({
      title: '',
      startTime: resetStartTime,
      duration: 30,
      color: getUniqueColor(),
      hour: resetHour,
      minute: resetMinute,
      period: resetPeriod,
    });

    setShowCustomInput(false);
    setCustomActivity('');
    setSaveCustomActivity(false);
  };

  const handleTimeSlotClick = (e, slotHour) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPosition = clickX / rect.width;
    // Round to nearest 5 minutes
    const minutes = Math.round((clickPosition * 60) / 5) * 5;
    const startTime = `${slotHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    if (checkForOverlap(startTime, 30, events)) {
      alert('This time slot overlaps with an existing event');
      return;
    }

    const newEvent = {
      id: uuidv4(),
      title: '',
      startTime,
      duration: 30,
      color: getUniqueColor(),
      isTemporary: true,
    };

    setEvents(prev => [...prev, newEvent]);
    setEditingEventId(newEvent.id);
  };

  const handleTimeBlockChange = (e, eventId) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId ? { ...event, title: e.target.value } : event
    ));
  };

  const handleTimeBlockKeyPress = (e, eventId) => {
    if (e.key === 'Enter') {
      setEvents(prev => prev.map(event =>
        event.id === eventId ? { ...event, isTemporary: false } : event
      ));
      setEditingEventId(null);
    }
  };

  const handleTimeBlockBlur = (eventId) => {
    setEvents(prev => prev.filter(event => !event.isTemporary || event.id !== eventId));
    setEditingEventId(null);
  };

  const handleDragStart = (e, eventId, slotIndex) => {
    e.preventDefault();
    const rect = timeSlotRefs.current[slotIndex]?.getBoundingClientRect();
    if (!rect) return;
    setDraggingEventId(eventId);
    setDragStartX(e.clientX);
    document.addEventListener('pointermove', handleDragMove);
    document.addEventListener('pointerup', handleDragEnd);
  };

  const handleDragMove = (e) => {
    if (!draggingEventId || dragStartX === null) return;
    const slotIndex = timeSlotRefs.current.findIndex(ref => ref?.contains(e.target));
    if (slotIndex === -1) return;

    const rect = timeSlotRefs.current[slotIndex]?.getBoundingClientRect();
    if (!rect) return;

    const deltaX = e.clientX - dragStartX;
    const minutesPerPixel = 60 / rect.width;
    const minutesChange = Math.round((deltaX * minutesPerPixel) / 5) * 5;
    const currentEvent = events.find(event => event.id === draggingEventId);
    if (!currentEvent) return;

    const newDuration = Math.max(5, Math.min(480, currentEvent.duration + minutesChange));

    if (checkForOverlap(currentEvent.startTime, newDuration, events, draggingEventId)) {
      alert('This duration would cause an overlap with another event');
      return;
    }

    setEvents(prev => prev.map(event =>
      event.id === draggingEventId ? { ...event, duration: newDuration } : event
    ));
  };

  const handleDragEnd = () => {
    setDraggingEventId(null);
    setDragStartX(null);
    document.removeEventListener('pointermove', handleDragMove);
    document.removeEventListener('pointerup', handleDragEnd);
  };

  const calculateEventSpans = (event, slotHour) => {
    const [eventHour, eventMinute] = event.startTime.split(':').map(Number);
    const eventStartMinutes = eventHour * 60 + eventMinute;
    const eventEndMinutes = eventStartMinutes + event.duration;
    const slotStartMinutes = slotHour * 60;
    const slotEndMinutes = slotStartMinutes + 60;

    if (eventEndMinutes <= slotStartMinutes || eventStartMinutes >= slotEndMinutes) {
      return null;
    }

    const startInSlot = Math.max(eventStartMinutes, slotStartMinutes);
    const endInSlot = Math.min(eventEndMinutes, slotEndMinutes);
    const durationInSlot = endInSlot - startInSlot;

    // Use precise percentage calculation to ensure correct positioning
    const startPercent = ((startInSlot - slotStartMinutes) / 60) * 100;
    const durationPercent = (durationInSlot / 60) * 100;

    return { event, startPercent, durationPercent };
  };

  const handleTodoChange = (id, text) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, text } : todo
    ));
  };

  const handleTodoToggle = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleTodoKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
      setFocusedTodoId(null);
    }
  };

  const handleTodoFocus = (id) => {
    setFocusedTodoId(id);
  };

  const handleTodoBlur = () => {
    setFocusedTodoId(null);
  };

  const handleTopItemChange = (id, text) => {
    setTopItems(prev => prev.map(item =>
      item.id === id ? { ...item, text } : item
    ));
  };

  const handleTopItemToggle = (id) => {
    setTopItems(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleTopItemKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
      setFocusedTodoId(null);
    }
  };

  const handleGratitudeSubmit = () => {
    if (gratitudeState.text.trim()) {
      setGratitudeState(prev => ({ ...prev, submitted: true }));
    }
  };

  const handleGratitudeChange = (e) => {
    setGratitudeState(prev => ({ ...prev, text: e.target.value }));
  };

  const handleGratitudeEdit = () => {
    setGratitudeState(prev => ({ ...prev, submitted: false }));
  };

  const handleAddNote = () => {
    setNotes(prev => [...prev, '']);
  };

  const handleNoteChange = (index, value) => {
    setNotes(prev => prev.map((note, i) => i === index ? value : note));
  };

  const handleDeleteNote = (index) => {
    setNotes(prev => prev.filter((_, i) => i !== index));
  };

  const quotes = [
    // Ancient Philosophy
    { text: "The unexamined life is not worth living.", author: "Socrates" },
    { text: "Happiness depends upon ourselves.", author: "Aristotle" },
    { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
    { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
    { text: "The mind is everything. What you think you become.", author: "Buddha" },
    { text: "He who is not a good servant will not be a good master.", author: "Plato" },
    { text: "No man ever steps in the same river twice.", author: "Heraclitus" },
    { text: "The way to gain a good reputation is to endeavor to be what you desire to appear.", author: "Socrates" },
    { text: "Everything flows and nothing abides.", author: "Heraclitus" },
    { text: "When you arise in the morning, think of what a precious privilege it is to be alive.", author: "Marcus Aurelius" },
    
    // Eastern Wisdom
    { text: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi" },
    { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
    { text: "In the midst of chaos, there is also opportunity.", author: "Sun Tzu" },
    { text: "Silence is the true friend that never betrays.", author: "Confucius" },
    { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
    { text: "Where there is love, there is life.", author: "Mahatma Gandhi" },
    { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
    { text: "To know that we know what we know, and to know that we do not know what we do not know, that is true knowledge.", author: "Nicolaus Copernicus" },
    { text: "Knowledge is a treasure, but practice is the key to it.", author: "Lao Tzu" },
    { text: "Knowing others is wisdom, knowing yourself is enlightenment.", author: "Lao Tzu" },
    
    // Black Leaders and Thinkers
    { text: "Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that.", author: "Martin Luther King Jr." },
    { text: "If there is no struggle, there is no progress.", author: "Frederick Douglass" },
    { text: "The most common way people give up their power is by thinking they don't have any.", author: "Alice Walker" },
    { text: "I have learned over the years that when one's mind is made up, this diminishes fear.", author: "Rosa Parks" },
    { text: "Success is to be measured not so much by the position that one has reached in life as by the obstacles which he has overcome.", author: "Booker T. Washington" },
    { text: "We all have dreams. But in order to make dreams come into reality, it takes an awful lot of determination, dedication, self-discipline, and effort.", author: "Jesse Owens" },
    { text: "You're not to be so blind with patriotism that you can't face reality. Wrong is wrong, no matter who does it or says it.", author: "Malcolm X" },
    { text: "I am not free while any woman is unfree, even when her shackles are very different from my own.", author: "Audre Lorde" },
    { text: "When we're talking about diversity, it's not a box to check. It is a reality that should be deeply felt and held and valued by all of us.", author: "Ava DuVernay" },
    { text: "You can't separate peace from freedom because no one can be at peace unless he has his freedom.", author: "Malcolm X" },
    
    // Women Leaders and Thinkers
    { text: "I am not afraid of storms, for I am learning how to sail my ship.", author: "Louisa May Alcott" },
    { text: "The question isn't who's going to let me; it's who's going to stop me.", author: "Ayn Rand" },
    { text: "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.", author: "Maya Angelou" },
    { text: "We need to accept that we won't always make the right decisions, that we'll screw up royally sometimes – understanding that failure is not the opposite of success, it's part of success.", author: "Arianna Huffington" },
    { text: "If you obey all the rules, you miss all the fun.", author: "Katharine Hepburn" },
    { text: "I've been absolutely terrified every moment of my life—and I've never let it keep me from doing a single thing I wanted to do.", author: "Georgia O'Keeffe" },
    { text: "A bird doesn't sing because it has an answer, it sings because it has a song.", author: "Maya Angelou" },
    { text: "If you don't like the road you're walking, start paving another one.", author: "Dolly Parton" },
    { text: "A feminist is anyone who recognizes the equality and full humanity of women and men.", author: "Gloria Steinem" },
    { text: "No one can make you feel inferior without your consent.", author: "Eleanor Roosevelt" },
    
    // Modern Thought Leaders
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "When we strive to become better than we are, everything around us becomes better too.", author: "Paulo Coelho" },
    { text: "The biggest risk is not taking any risk. In a world that is changing quickly, the only strategy that is guaranteed to fail is not taking risks.", author: "Mark Zuckerberg" },
    { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
    { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
    
    // Literary Figures
    { text: "We are all in the gutter, but some of us are looking at the stars.", author: "Oscar Wilde" },
    { text: "It is never too late to be what you might have been.", author: "George Eliot" },
    { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", author: "Ralph Waldo Emerson" },
    { text: "Imperfection is beauty, madness is genius and it's better to be absolutely ridiculous than absolutely boring.", author: "Marilyn Monroe" },
    { text: "There is no greater agony than bearing an untold story inside you.", author: "Maya Angelou" },
    { text: "You never really understand a person until you consider things from his point of view.", author: "Harper Lee" },
    { text: "It is our choices that show what we truly are, far more than our abilities.", author: "J.K. Rowling" },
    { text: "It matters not what someone is born, but what they grow to be.", author: "J.K. Rowling" },
    { text: "How wonderful it is that nobody need wait a single moment before starting to improve the world.", author: "Anne Frank" },
    { text: "All you need is love. But a little chocolate now and then doesn't hurt.", author: "Charles M. Schulz" },
    
    // Scientists and Innovators
    { text: "Imagination is more important than knowledge.", author: "Albert Einstein" },
    { text: "The important thing is not to stop questioning. Curiosity has its own reason for existing.", author: "Albert Einstein" },
    { text: "If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.", author: "Nikola Tesla" },
    { text: "The good thing about science is that it's true whether or not you believe in it.", author: "Neil deGrasse Tyson" },
    { text: "Science knows no country, because knowledge belongs to humanity.", author: "Louis Pasteur" },
    { text: "In a gentle way, you can shake the world.", author: "Mahatma Gandhi" },
    { text: "If I have seen further it is by standing on the shoulders of Giants.", author: "Isaac Newton" },
    { text: "Life is not easy for any of us. But what of that? We must have perseverance and above all confidence in ourselves.", author: "Marie Curie" },
    { text: "Science and everyday life cannot and should not be separated.", author: "Rosalind Franklin" },
    { text: "I haven't failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
    
    // Latin American Voices
    { text: "I paint flowers so they will not die.", author: "Frida Kahlo" },
    { text: "The courage of life is often a less dramatic spectacle than the courage of a final moment.", author: "Eduardo Galeano" },
    { text: "Always remember that the most important thing in a good marriage is not happiness, but stability.", author: "Gabriel García Márquez" },
    { text: "It is not true that people stop pursuing dreams because they grow old; they grow old because they stop pursuing dreams.", author: "Gabriel García Márquez" },
    { text: "Feet, what do I need them for if I have wings to fly?", author: "Frida Kahlo" },
    { text: "Write what should not be forgotten.", author: "Isabel Allende" },
    { text: "Words can be like X-rays if you use them properly — they'll go through anything.", author: "Octavio Paz" },
    { text: "Silence is also conversation.", author: "Jorge Luis Borges" },
    { text: "Life itself is the most wonderful fairy tale.", author: "Paulo Coelho" },
    { text: "Nothing is absolute. Everything changes, everything moves, everything revolves, everything flies and goes away.", author: "Frida Kahlo" },
    
    // African Wisdom
    { text: "If you want to go fast, go alone. If you want to go far, go together.", author: "African Proverb" },
    { text: "When there is no enemy within, the enemies outside cannot hurt you.", author: "African Proverb" },
    { text: "However long the night, the dawn will break.", author: "African Proverb" },
    { text: "Peace is costly but it is worth the expense.", author: "Kenyan Proverb" },
    { text: "Many hands make light work.", author: "Tanzanian Proverb" },
    { text: "The best way to eat an elephant in your path is to cut it up into little pieces.", author: "African Proverb" },
    { text: "Knowledge without wisdom is like water in the sand.", author: "Guinean Proverb" },
    { text: "One who causes others misfortune also teaches them wisdom.", author: "African Proverb" },
    { text: "Do not follow a person who is running away.", author: "Kenyan Proverb" },
    { text: "When the music changes, so does the dance.", author: "Hausa Proverb" },
    
    // Asian Wisdom
    { text: "When angry, count ten before you speak; if very angry, a hundred.", author: "Chinese Proverb" },
    { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
    { text: "Vision without action is a daydream. Action without vision is a nightmare.", author: "Japanese Proverb" },
    { text: "A journey of a thousand miles begins with a single step.", author: "Chinese Proverb" },
    { text: "The bamboo that bends is stronger than the oak that resists.", author: "Japanese Proverb" },
    { text: "No one who rises before dawn 360 days a year fails to make his family rich.", author: "Chinese Proverb" },
    { text: "When you have only two pennies left in the world, buy a loaf of bread with one, and a lily with the other.", author: "Chinese Proverb" },
    { text: "Even a fish wouldn't get into trouble if it kept its mouth shut.", author: "Korean Proverb" },
    { text: "Patience is a tree whose root is bitter, but its fruit is very sweet.", author: "Chinese Proverb" },
    { text: "The nail that sticks out gets hammered down.", author: "Japanese Proverb" },
    
    // Indigenous Wisdom
    { text: "We are all visitors to this time, this place. We are just passing through. Our purpose here is to observe, to learn, to grow, to love… and then we return home.", author: "Australian Aboriginal Proverb" },
    { text: "When we show our respect for other living things, they respond with respect for us.", author: "Arapaho Proverb" },
    { text: "Tell me and I'll forget. Show me, and I may not remember. Involve me, and I'll understand.", author: "Native American Proverb" },
    { text: "The Earth does not belong to us. We belong to the Earth.", author: "Chief Seattle" },
    { text: "We do not inherit the earth from our ancestors, we borrow it from our children.", author: "Native American Proverb" },
    { text: "Walk lightly in the spring; Mother Earth is pregnant.", author: "Native American Proverb (Kiowa)" },
    { text: "All plants are our brothers and sisters. They talk to us and if we listen, we can hear them.", author: "Arapaho Proverb" },
    { text: "It is better to have less thunder in the mouth and more lightning in the hand.", author: "Apache Proverb" },
    { text: "Those who have one foot in the canoe, and one foot in the boat, are going to fall into the river.", author: "Tuscarora Proverb" },
    { text: "The frog does not drink up the pond in which he lives.", author: "Native American Proverb" },
    
    // Middle Eastern Wisdom
    { text: "The cure for ignorance is to question.", author: "Arabic Proverb" },
    { text: "If you want to write the truth, let your ink be love.", author: "Rumi" },
    { text: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", author: "Rumi" },
    { text: "Where there is ruin, there is hope for a treasure.", author: "Rumi" },
    { text: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.", author: "Rumi" },
    { text: "The wound is the place where the Light enters you.", author: "Rumi" },
    { text: "Raise your words, not voice. It is rain that grows flowers, not thunder.", author: "Rumi" },
    { text: "Patience is the key to joy.", author: "Persian Proverb" },
    { text: "A wise person listens to meaning; a fool only gets the noise.", author: "Kahil Gibran" },
    { text: "The person who tries to walk two roads will split his pants.", author: "Turkish Proverb" },
    
    // Contemporary Thought Leaders
    { text: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Change will not come if we wait for some other person or some other time.", author: "Barack Obama" },
    { text: "The most difficult thing is the decision to act, the rest is merely tenacity.", author: "Amelia Earhart" },
    { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas A. Edison" },
    { text: "What you do makes a difference, and you have to decide what kind of difference you want to make.", author: "Jane Goodall" },
    { text: "Everyone thinks of changing the world, but no one thinks of changing themselves.", author: "Leo Tolstoy" },
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  ];

  const getDailyQuote = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return quotes[dayOfYear % quotes.length];
  };

  useEffect(() => {
    setCurrentQuote(getDailyQuote());
  }, [currentDate]);

  const handleContextMenu = (e, eventId) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, eventId });
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  const handleEditEvent = (eventId) => {
    const eventToEdit = events.find(event => event.id === eventId);
    if (!eventToEdit) return;

    const [hourStr, minuteStr] = eventToEdit.startTime.split(':');
    const hour24 = parseInt(hourStr);
    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;
    const period = hour24 >= 12 ? 'PM' : 'AM';

    setNewEvent({
      title: eventToEdit.title,
      startTime: eventToEdit.startTime,
      duration: eventToEdit.duration,
      color: eventToEdit.color,
      hour: hour12.toString(),
      minute: minuteStr,
      period,
    });

    setEvents(prev => prev.filter(event => event.id !== eventId));
    setContextMenu(null);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    setContextMenu(null);
  };

  const handleActivityManagerToggle = () => {
    setShowActivityManager(prev => !prev);
  };

  const handleAddNewActivity = () => {
    if (!newActivity.trim()) {
      alert('Please enter an activity name');
      return;
    }
    
    if (activities.includes(newActivity.trim())) {
      alert('This activity already exists');
      return;
    }
    
    setActivities(prev => [...prev, newActivity.trim()]);
    setNewActivity('');
  };

  const handleDeleteActivity = (activityToDelete) => {
    setActivities(prev => prev.filter(activity => activity !== activityToDelete));
  };

  // Update the search functionality to match exact phrases
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!value.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    // Filter results based on search term for exact phrase matching
    const results = Object.entries(storedDays)
      .filter(([date, data]) => {
        // Match exact phrases in gratitude text
        if (data.gratitude && data.gratitude.includes(value)) {
          return true;
        }
        
        // Match exact phrases in todos
        if (data.todos && data.todos.some(todo => 
          todo.text.includes(value)
        )) {
          return true;
        }
        
        // Match exact phrases in notes
        if (data.notes && data.notes.some(note => 
          note.includes(value)
        )) {
          return true;
        }
        
        return false;
      })
      .map(([date, data]) => {
        // Find what matched for display purposes
        let matchDetails = '';
        
        if (data.gratitude && data.gratitude.includes(value)) {
          matchDetails = `Gratitude: "${data.gratitude}"`;
        } else {
          // Check todos
          const matchedTodo = data.todos.find(todo => 
            todo.text.includes(value)
          );
          
          if (matchedTodo) {
            matchDetails = `Todo: "${matchedTodo.text}"`;
          } else {
            // Check notes
            const matchedNote = data.notes.find(note => 
              note.includes(value)
            );
            
            if (matchedNote) {
              matchDetails = `Note: "${matchedNote}"`;
            }
          }
        }
        
        return {
          date,
          matchDetails,
          data
        };
      });
    
    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  };
  
  const handleSearchResultClick = (date) => {
    setCurrentDate(date);
    setSearchTerm('');
    setShowSearchResults(false);
    
    // In a real app, you would load the data for this date
    // For now, we'll just demonstrate switching to the date
  };

  // Add this state and ref to track calendar state
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const datePickerRef = useRef(null);

  // Replace the existing calendar-related useEffect with this improved version
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isCalendarOpen && datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        // If calendar is open and click is outside the date picker
        setIsCalendarOpen(false);
        const dateInput = document.querySelector('input[type="date"]');
        if (dateInput) {
          dateInput.blur();
          
          // Force the native calendar to close in different browsers
          if (document.activeElement) {
            document.activeElement.blur();
          }
        }
      }
    };

    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isCalendarOpen]);

  return (
    <AppContainer>
      <PlannerContainer>
        <DatePickerRow>
          <DateNavContainer ref={datePickerRef}>
            <DateNavRow>
              <DateNavButton onClick={() => setCurrentDate(new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() - 1)).toISOString().split('T')[0])}>
                ←
              </DateNavButton>
              <DatePicker
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                onFocus={() => setIsCalendarOpen(true)}
                onBlur={(e) => {
                  // Only close if not clicking the calendar button
                  if (!e.relatedTarget || e.relatedTarget.id !== 'calendar-button') {
                    setIsCalendarOpen(false);
                  }
                }}
              />
              <DateNavButton onClick={() => setCurrentDate(new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() + 1)).toISOString().split('T')[0])}>
                →
              </DateNavButton>
            </DateNavRow>
            <CalendarButton 
              id="calendar-button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const dateInput = document.querySelector('input[type="date"]');
                if (dateInput) {
                  dateInput.showPicker();
                  setIsCalendarOpen(true);
                  dateInput.focus();
                }
              }}
            >
              📅
            </CalendarButton>
          </DateNavContainer>
          
          <SearchBarContainer>
            <SearchInput
              type="text"
              placeholder="Search for keywords..."
              value={searchTerm}
              onChange={handleSearchChange}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
            />
            {showSearchResults && (
              <SearchResults>
                {searchResults.map((result) => (
                  <SearchResultItem 
                    key={result.date} 
                    onClick={() => handleSearchResultClick(result.date)}
                  >
                    <span className="date">{result.date}</span>
                    <span className="match-info">{result.matchDetails}</span>
                  </SearchResultItem>
                ))}
              </SearchResults>
            )}
          </SearchBarContainer>
          
          <Header>Daily Planner</Header>
        </DatePickerRow>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <GratefulSection style={{ width: '49%' }}>
            {!gratitudeState.submitted ? (
              <>
                <GratefulInput
                  placeholder="I am grateful for..."
                  value={gratitudeState.text}
                  onChange={handleGratitudeChange}
                />
                <SubmitButton onClick={handleGratitudeSubmit}>
                  Submit
                </SubmitButton>
              </>
            ) : (
              <GratefulDisplay>
                <div className="gratitude-label">I am grateful for</div>
                <div className="gratitude-text">{gratitudeState.text}</div>
                <button className="edit-button" onClick={handleGratitudeEdit}>
                  Edit
                </button>
              </GratefulDisplay>
            )}
          </GratefulSection>

          <div style={{ width: '49%' }}>
            {currentQuote && (
              <QuoteSection>
                <div className="quote-text">"{currentQuote.text}"</div>
                <div className="quote-author">- {currentQuote.author}</div>
              </QuoteSection>
            )}
          </div>
        </div>

        <TopItems>
          <h2>Top 5 Items</h2>
          <TodoList style={{ maxHeight: '200px' }}>
            {topItems.map((item) => (
              <TodoItem key={item.id} completed={item.completed}>
                <input
                  type="text"
                  placeholder={`Item ${parseInt(item.id) + 1}`}
                  value={item.text}
                  onChange={(e) => handleTopItemChange(item.id, e.target.value)}
                  onKeyPress={(e) => handleTopItemKeyPress(e, item.id)}
                  onFocus={() => handleTodoFocus(item.id)}
                  onBlur={handleTodoBlur}
                  className={focusedTodoId === item.id ? 'focused' : ''}
                />
                {item.text && (
                  <button onClick={() => handleTopItemToggle(item.id)}>
                    {item.completed ? 'Undo' : 'Done'}
                  </button>
                )}
              </TodoItem>
            ))}
          </TodoList>
        </TopItems>

        <Grid>
          <Section>
            <h2>Schedule</h2>
            <div style={{ maxWidth: '450px' }}>
              <EventControls>
                {showActivityManager ? (
                  <div>
                    <ControlRow>
                      <div style={{ width: '100%', marginBottom: '10px' }}>
                        <h3 style={{ margin: '0 0 10px 0' }}>Manage Activities</h3>
                        <div style={{ display: 'flex', marginBottom: '15px' }}>
                          <CustomActivityInput
                            type="text"
                            placeholder="Enter new activity"
                            value={newActivity}
                            onChange={(e) => setNewActivity(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') handleAddNewActivity();
                            }}
                            style={{ flex: 1, marginRight: '10px' }}
                          />
                          <ControlButton onClick={handleAddNewActivity}>Add</ControlButton>
                        </div>
                        <div style={{ 
                          maxHeight: '150px', 
                          overflowY: 'auto', 
                          border: '1px solid #e0e0e0',
                          borderRadius: '4px',
                          padding: '10px'
                        }}>
                          {activities.map((activity) => (
                            <div key={activity} style={{ 
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '5px 0',
                              borderBottom: '1px solid #f0f0f0'
                            }}>
                              <span>{activity}</span>
                              <button
                                onClick={() => handleDeleteActivity(activity)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#ff5252',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  padding: '2px 6px',
                                  borderRadius: '3px'
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </ControlRow>
                    <ControlButton onClick={handleActivityManagerToggle} style={{ marginTop: '10px' }}>
                      Done
                    </ControlButton>
                  </div>
                ) : showCustomInput ? (
                  <>
                    <ControlRow>
                      <TimeSelectContainer>
                        <TimeSelect
                          value={newEvent.hour}
                          onChange={(e) => handleTimeChange('hour', e.target.value)}
                        >
                          {hours.map((hour) => (
                            <option key={hour} value={hour}>{hour}</option>
                          ))}
                        </TimeSelect>
                        <TimeSelect
                          value={newEvent.minute}
                          onChange={(e) => handleTimeChange('minute', e.target.value)}
                        >
                          {minutes.map((minute) => (
                            <option key={minute} value={minute}>{minute}</option>
                          ))}
                        </TimeSelect>
                        <TimeSelect
                          value={newEvent.period}
                          onChange={(e) => handleTimeChange('period', e.target.value)}
                        >
                          {periods.map((period) => (
                            <option key={period} value={period}>{period}</option>
                          ))}
                        </TimeSelect>
                      </TimeSelectContainer>
                      <DurationSelect
                        value={newEvent.duration.toString()}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      >
                        {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((duration) => (
                          <option key={duration} value={duration}>{duration}</option>
                        ))}
                      </DurationSelect>
                      <SaveActivityCheckbox>
                        <input
                          type="checkbox"
                          id="saveActivity"
                          checked={saveCustomActivity}
                          onChange={(e) => setSaveCustomActivity(e.target.checked)}
                        />
                        <label htmlFor="saveActivity">Save</label>
                      </SaveActivityCheckbox>
                      <ControlButton onClick={handleCustomActivitySubmit}>Add</ControlButton>
                      <ControlButton onClick={() => {
                        setShowCustomInput(false);
                        setCustomActivity('');
                        setSaveCustomActivity(false);
                      }}>
                        Cancel
                      </ControlButton>
                    </ControlRow>
                    <CustomActivityInput
                      type="text"
                      placeholder="Enter custom activity"
                      value={customActivity}
                      onChange={(e) => setCustomActivity(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleCustomActivitySubmit();
                      }}
                    />
                  </>
                ) : (
                  <ControlRow>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '150px' }}>
                      <ActivitySelect
                        value={newEvent.title}
                        onChange={(e) => {
                          if (e.target.value === 'custom') {
                            setShowCustomInput(true);
                          } else {
                            setNewEvent(prev => ({ ...prev, title: e.target.value }));
                          }
                        }}
                      >
                        <option value="">Select activity</option>
                        {activities.map((activity) => (
                          <option key={activity} value={activity}>{activity}</option>
                        ))}
                        <option value="custom">Custom Activity...</option>
                      </ActivitySelect>
                      <button 
                        onClick={handleActivityManagerToggle}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#80CBC4',
                          cursor: 'pointer',
                          fontSize: '10px',
                          padding: '2px 0',
                          textAlign: 'center',
                          width: '100%'
                        }}
                      >
                        Manage Activities
                      </button>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <TimeSelectContainer>
                          <TimeSelect
                            value={newEvent.hour}
                            onChange={(e) => handleTimeChange('hour', e.target.value)}
                          >
                            {hours.map((hour) => (
                              <option key={hour} value={hour}>{hour}</option>
                            ))}
                          </TimeSelect>
                          <TimeSelect
                            value={newEvent.minute}
                            onChange={(e) => handleTimeChange('minute', e.target.value)}
                          >
                            {minutes.map((minute) => (
                              <option key={minute} value={minute}>{minute}</option>
                            ))}
                          </TimeSelect>
                          <TimeSelect
                            value={newEvent.period}
                            onChange={(e) => handleTimeChange('period', e.target.value)}
                          >
                            {periods.map((period) => (
                              <option key={period} value={period}>{period}</option>
                            ))}
                          </TimeSelect>
                        </TimeSelectContainer>

                        <DurationSelect
                          value={newEvent.duration.toString()}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                        >
                          {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((duration) => (
                            <option key={duration} value={duration}>{duration}</option>
                          ))}
                        </DurationSelect>
                        
                        <ControlButton onClick={handleAddEvent}>Add</ControlButton>
                      </div>
                      <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                        Start Time&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Duration
                      </div>
                    </div>
                  </ControlRow>
                )}
              </EventControls>
              <Schedule>
                {displayTimeSlots.map(({ label, value }, index) => {
                  const slotHour = parseInt(value.split(':')[0]);
                  const hourEvents = events
                    .map(event => calculateEventSpans(event, slotHour))
                    .filter(span => span !== null);

                  return (
                    <TimeSlot key={value}>
                      <span>{label}</span>
                      <TimeSlotContainer
                        ref={el => (timeSlotRefs.current[index] = el)}
                        onClick={(e) => handleTimeSlotClick(e, slotHour)}
                      >
                        {hourEvents.map(({ event, startPercent, durationPercent }) => (
                          <TimeBlock
                            key={event.id}
                            startPercent={startPercent}
                            durationPercent={durationPercent}
                            color={event.color}
                            onContextMenu={(e) => handleContextMenu(e, event.id)}
                          >
                            {editingEventId === event.id ? (
                              <input
                                type="text"
                                value={event.title}
                                onChange={(e) => handleTimeBlockChange(e, event.id)}
                                onKeyPress={(e) => handleTimeBlockKeyPress(e, event.id)}
                                onBlur={() => handleTimeBlockBlur(event.id)}
                                placeholder="Edit..."
                                autoFocus
                              />
                            ) : (
                              <div style={{ 
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '100%'
                              }}>
                                {event.title || 'Click to edit'}
                              </div>
                            )}
                            <ResizeHandle
                              onPointerDown={(e) => handleDragStart(e, event.id, index)}
                            />
                            {draggingEventId === event.id && (
                              <DurationIndicator>{event.duration} minutes</DurationIndicator>
                            )}
                          </TimeBlock>
                        ))}
                      </TimeSlotContainer>
                    </TimeSlot>
                  );
                })}
              </Schedule>
            </div>
          </Section>

          <Section>
            <h2>To Do</h2>
            <div style={{ 
              height: '446px', // Height to match the schedule ending at 10:00 pm
              display: 'flex',
              flexDirection: 'column'
            }}>
              <TodoList>
                {todos.map((todo) => (
                  <TodoItem key={todo.id} completed={todo.completed}>
                    <input
                      type="text"
                      placeholder={`Task ${parseInt(todo.id) + 1}`}
                      value={todo.text}
                      onChange={(e) => handleTodoChange(todo.id, e.target.value)}
                      onKeyPress={(e) => handleTodoKeyPress(e, todo.id)}
                      onFocus={() => handleTodoFocus(todo.id)}
                      onBlur={handleTodoBlur}
                      className={focusedTodoId === todo.id ? 'focused' : ''}
                    />
                    {todo.text && (
                      <button onClick={() => handleTodoToggle(todo.id)}>
                        {todo.completed ? 'Undo' : 'Done'}
                      </button>
                    )}
                  </TodoItem>
                ))}
              </TodoList>
            </div>
          </Section>
        </Grid>

        <Section>
          <h2>Notes</h2>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <NotesContainer>
              {notes.map((note, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <NoteBox
                    placeholder={`Note ${index + 1}`}
                    value={note}
                    onChange={(e) => handleNoteChange(index, e.target.value)}
                  />
                  {notes.length > 1 && (
                    <button
                      onClick={() => handleDeleteNote(index)}
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: '0 4px',
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <AddNoteButton onClick={handleAddNote}>Add Note</AddNoteButton>
            </NotesContainer>
          </div>
        </Section>

        {contextMenu && (
          <ContextMenu x={contextMenu.x} y={contextMenu.y}>
            <button onClick={() => handleEditEvent(contextMenu.eventId)}>Edit</button>
            <button onClick={() => handleDeleteEvent(contextMenu.eventId)}>Delete</button>
          </ContextMenu>
        )}
      </PlannerContainer>
    </AppContainer>
  );
}

export default App;