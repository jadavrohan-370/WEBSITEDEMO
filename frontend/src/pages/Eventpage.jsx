// import React, { useState, useEffect, useRef } from 'react';
// import { Camera, Calendar, MapPin, ArrowRight, Users, ChefHat, PartyPopper } from 'lucide-react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import CountUp from '../components/CountUp';

// gsap.registerPlugin(ScrollTrigger);


// const eventsData = [
//     {
//         id: 1,
//         title: "Chinese Food",
//         category: "Noodles",
//         image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
//         description: "A majestic destination wedding with traditional aesthetics."
//     },
//     {
//         id: 2,
//         title: "Pasta",
//         category: "Pasta",
//         image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
//         description: "Annual technology conference for industry leaders."
//     },
//     {
//         id: 3,
//         title: "Burger",
//         category: "Burger",
//         image: "https://images.unsplash.com/photo-1464349153912-6a4be6355212?q=80&w=2068&auto=format&fit=crop",
//         description: "Celebrating 50 years with grandeur and joy."
//     },
//     {
//         id: 4,
//         title: "Pizza",
//         category: "Pizza",
//         image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop",
//         description: "Strategic networking event for global partners."
//     },
//     {
//         id: 5,
//         title: "Biryani",
//         category: "Biryani",
//         image: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=2070&auto=format&fit=crop",
//         description: "A vibrant outdoor setup for a pre-wedding musical night."
//     },
//     {
//         id: 6,
//         title: "Farsan",
//         category: "Farsan",
//         image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
//         description: "Networking dinner for emerging startups."
//     }
// ];

// const Eventpage = () => {
//     const [activeTab, setActiveTab] = useState('All Events');
//     const containerRef = useRef(null);

//     const filteredEvents = activeTab === 'All Events'
//         ? eventsData
//         : eventsData.filter(event => event.category === activeTab);

//     useEffect(() => {
//         const ctx = gsap.context(() => {
//             // Header Animation
//             gsap.fromTo(".section-header > *",
//                 { y: 30, opacity: 0 },
//                 { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out", scrollTrigger: { trigger: ".section-header", start: "top 80%" } }
//             );

//             // Stats Animation
//             gsap.fromTo(".stat-card",
//                 { scale: 0.8, opacity: 0 },
//                 { scale: 1, opacity: 1, duration: 0.6, stagger: 0.15, ease: "back.out(1.7)", scrollTrigger: { trigger: ".stats-container", start: "top 85%" } }
//             );

//             // Filter Animation
//             gsap.fromTo(".filter-btn",
//                 { y: 20, opacity: 0 },
//                 { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, delay: 0.2, scrollTrigger: { trigger: ".filter-container", start: "top 85%" } }
//             );

//             // Cards Animation
//             gsap.fromTo(".event-card",
//                 { y: 50, opacity: 0 },
//                 { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".events-grid", start: "top 85%" } }
//             );
//         }, containerRef);

//         return () => ctx.revert();
//     }, []);

//     return (
//         <div ref={containerRef} className="bg-stone-50 min-h-screen py-32 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-7xl mx-auto">

//                 {/* Header */}
//                 <div className="text-center mb-16 section-header">
//                     <h5 className="inline-block px-5 py-2 rounded-full border border-orange-200 bg-orange-50 text-orange-600 text-sm font-bold tracking-widest uppercase mb-4">
//                         Events
//                     </h5>
//                     <h2 className="text-5xl md:text-6xl font-display text-stone-900 mb-6 drop-shadow-sm">
//                         Events <span className="text-orange-600">Page</span>
//                     </h2>
//                     <p className="max-w-2xl mx-auto text-lg text-stone-500 font-light leading-relaxed">
//                         Witness the elegance and precision of our events. We turn tailored concepts into unforgettable realities.
//                     </p>
//                 </div>

//                 {/* Stats Section */}
//                 <div className="stats-container flex flex-wrap justify-center gap-6 lg:gap-8 mb-20">
//                     {/* Happy Customer */}
//                     <div className="stat-card bg-orange-600 rounded-4xl p-8 flex flex-col items-center justify-center text-white w-full sm:w-64 aspect-square shadow-xl hover:-translate-y-2 transition-transform duration-300">
//                         <Users size={48} className="mb-4 stroke-[1.5]" />
//                         <span className="font-display text-2xl mb-2 tracking-wide">Happy Customer</span>
//                         <div className="text-4xl font-bold flex items-center">
//                             <CountUp from={0} to={200} duration={2} />
//                             <span className="ml-1">+</span>
//                         </div>
//                     </div>

//                     {/* Expert Chef */}
//                     <div className="stat-card bg-orange-600 rounded-4xl p-8 flex flex-col items-center justify-center text-white w-full sm:w-64 aspect-square shadow-xl hover:-translate-y-2 transition-transform duration-300">
//                         <ChefHat size={48} className="mb-4 stroke-[1.5]" />
//                         <span className="font-display text-2xl mb-2 tracking-wide">Expert Chef</span>
//                         <div className="text-4xl font-bold flex items-center">
//                             <CountUp from={0} to={200} duration={2} />
//                             <span className="ml-1">+</span>
//                         </div>
//                     </div>

//                     {/* Events Done */}
//                     <div className="stat-card bg-orange-600 rounded-4xl p-8 flex flex-col items-center justify-center text-white w-full sm:w-64 aspect-square shadow-xl hover:-translate-y-2 transition-transform duration-300">
//                         <PartyPopper size={48} className="mb-4 stroke-[1.5]" />
//                         <span className="font-display text-2xl mb-2 tracking-wide">Events Done</span>
//                         <div className="text-4xl font-bold flex items-center">
//                             <CountUp from={0} to={150} duration={2} />
//                             <span className="ml-1">+</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Filters */}
//                 <div className="filter-container flex flex-wrap justify-center gap-3 mb-20">
//                     {['All Events', ...new Set(eventsData.map(item => item.category))].map((tab) => (
//                         <button
//                             key={tab}
//                             onClick={() => setActiveTab(tab)}
//                             className={`filter-btn px-6 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300 transform hover:-translate-y-1 ${activeTab === tab
//                                 ? 'bg-orange-600 text-white shadow-lg shadow-orange-200 scale-105'
//                                 : 'bg-white text-stone-500 border border-stone-200 hover:border-orange-300 hover:text-orange-600 hover:shadow-md'
//                                 }`}
//                         >
//                             {tab}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Grid */}
//                 <div className="events-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {filteredEvents.map((event) => (
//                         <div
//                             key={event.id}
//                             className="event-card group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-stone-100 flex flex-col h-full"
//                         >
//                             {/* Image Container */}
//                             <div className="relative h-80 overflow-hidden">
//                                 <div className="absolute inset-0 bg-z-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-10" />
//                                 <img
//                                     src={event.image}
//                                     alt={event.title}
//                                     className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
//                                 />
//                                 <div className="absolute top-5 left-5 z-20">
//                                     <span className="bg-white/95 backdrop-blur-sm text-orange-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
//                                         {event.category}
//                                     </span>
//                                 </div>
//                             </div>

//                             {/* Menu */}
//                             <div className="p-8 flex flex-col grow relative">

//                                 {/* Floating Date Badge */}
//                                 <div className="absolute -top-6 right-8 bg-orange-600 text-white p-3 rounded-xl shadow-lg text-center min-w-3.5rem group-hover:-translate-y-2 transition-transform duration-300 z-20">
//                                     {/* Header */}

//                                     {/* Date */}
//                                     <span className="block text-xs uppercase font-medium">Panner </span>
//                                     <span className="block text-xl font-bold font-display leading"></span>
//                                 </div>

//                                 <div className="flex items-center gap-2 text-stone-400 text-xs font-medium uppercase tracking-wide mb-3 mt-2">
//                                     <MapPin size={14} className="text-orange-50" /> {event.location}
//                                 </div>

//                                 <h3 className="text-2xl font-display font-medium text-stone-800 mb-3 group-hover:text-orange-600 transition-colors">
//                                     {event.title}
//                                 </h3>

//                                 <p className="text-stone-500 text-sm leading-relaxed mb-6 grow border-b border-stone-100 pb-6 border-dashed">
//                                     {event.description}
//                                 </p>

//                                 <button className="flex items-center justify-between w-full text-stone-800 font-bold uppercase text-xs tracking-widest group/btn hover:text-orange-600 transition-colors">
//                                     View Project
//                                     <span className="bg-stone-100 p-2 rounded-full group-hover/btn:bg-orange-100 group-hover/btn:text-orange-600 transition-colors">
//                                         <ArrowRight size={16} className="transform group-hover/btn:-rotate-45 transition-transform duration-300" />
//                                     </span>
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {filteredEvents.length === 0 && (
//                     <div className="text-center py-20 text-stone-400 animate-pulse">
//                         <Camera size={64} className="mx-auto mb-6 opacity-20" />
//                         <p className="text-xl font-display">No events found in this category yet.</p>
//                     </div>
//                 )}

//             </div>
//         </div>
//     );
// }

// export default Eventpage;
