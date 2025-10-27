const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Location = require('./models/Location');
const Friend = require('./models/Friend');
const News = require('./models/News');
const Notice = require('./models/Notice');

const shouldClearData = process.argv.includes('--clear');

const locationsData = [
  {
    useCounty: "0",
    stateEn: "Kyivska",
    cityEn: "Kyiv",
    countyEn: "Kyivskyi",
    stateUa: "Київська",
    cityUa: "Київ"
  },
  {
    useCounty: "0",
    stateEn: "Lvivska",
    cityEn: "Lviv",
    countyEn: "Lvivskyi",
    stateUa: "Львівська",
    cityUa: "Львів"
  },
  {
    useCounty: "0",
    stateEn: "Dnipropetrovska",
    cityEn: "Dnipro",
    countyEn: "Dniprovskyi",
    stateUa: "Дніпропетровська",
    cityUa: "Дніпро"
  },
  {
    useCounty: "0",
    stateEn: "Odeska",
    cityEn: "Odesa",
    countyEn: "Odeskyi",
    stateUa: "Одеська",
    cityUa: "Одеса"
  },
  {
    useCounty: "0",
    stateEn: "Kharkivska",
    cityEn: "Kharkiv",
    countyEn: "Kharkivskyi",
    stateUa: "Харківська",
    cityUa: "Харків"
  },
  {
    useCounty: "0",
    stateEn: "Zakarpatska",
    cityEn: "Uzhhorod",
    countyEn: "Uzhhorodskyi",
    stateUa: "Закарпатська",
    cityUa: "Ужгород"
  },
  {
    useCounty: "0",
    stateEn: "Zaporizka",
    cityEn: "Zaporizhzhia",
    countyEn: "Zaporizkyi",
    stateUa: "Запорізька",
    cityUa: "Запоріжжя"
  },
  {
    useCounty: "0",
    stateEn: "Ivano-Frankivska",
    cityEn: "Ivano-Frankivsk",
    countyEn: "Ivano-Frankivskyi",
    stateUa: "Івано-Франківська",
    cityUa: "Івано-Франківськ"
  },
  {
    useCounty: "0",
    stateEn: "Poltavska",
    cityEn: "Poltava",
    countyEn: "Poltavskyi",
    stateUa: "Полтавська",
    cityUa: "Полтава"
  },
  {
    useCounty: "0",
    stateEn: "Chernihivska",
    cityEn: "Chernihiv",
    countyEn: "Chernihivskyi",
    stateUa: "Чернігівська",
    cityUa: "Чернігів"
  },
  {
    useCounty: "0",
    stateEn: "Vinnytska",
    cityEn: "Vinnytsia",
    countyEn: "Vinnytskyi",
    stateUa: "Вінницька",
    cityUa: "Вінниця"
  },
  {
    useCounty: "0",
    stateEn: "Mykolaivska",
    cityEn: "Mykolaiv",
    countyEn: "Mykolaivskyi",
    stateUa: "Миколаївська",
    cityUa: "Миколаїв"
  },
  {
    useCounty: "0",
    stateEn: "Ternopilska",
    cityEn: "Ternopil",
    countyEn: "Ternopilskyi",
    stateUa: "Тернопільська",
    cityUa: "Тернопіль"
  },
  {
    useCounty: "0",
    stateEn: "Chernivetska",
    cityEn: "Chernivtsi",
    countyEn: "Chernivtskyi",
    stateUa: "Чернівецька",
    cityUa: "Чернівці"
  },
  {
    useCounty: "0",
    stateEn: "Sumska",
    cityEn: "Sumy",
    countyEn: "Sumskyi",
    stateUa: "Сумська",
    cityUa: "Суми"
  }
];

const friendsData = [
  {
    title: "Happy Paw Veterinary Clinic",
    url: "https://happypaw.ua",
    addressUrl: "https://goo.gl/maps/3RyzTYBvMr9WQWCC6",
    imageUrl: "https://ftp.goit.study/img/petsfriends/1.webp",
    address: "44 Shota Rustaveli Street, Kyiv, 3rd floor, office 7",
    workDays: [
      { isOpen: true, from: "09:00", to: "19:00" },
      { isOpen: true, from: "09:00", to: "19:00" },
      { isOpen: true, from: "09:00", to: "19:00" },
      { isOpen: true, from: "09:00", to: "19:00" },
      { isOpen: true, from: "09:00", to: "19:00" },
      { isOpen: true, from: "10:00", to: "17:00" },
      { isOpen: true, from: "10:00", to: "16:00" }
    ],
    phone: "+380442900329",
    email: "hello@happypaw.ua"
  },
  {
    title: "Sirius Animal Shelter",
    url: "https://sirius-shelter.org",
    addressUrl: "https://goo.gl/maps/iq8NXEUf31EAQCzc6",
    imageUrl: "https://ftp.goit.study/img/petsfriends/2.webp",
    address: "Fedorivka village, Kyiv Oblast, Ukraine, 07372",
    workDays: [
      { isOpen: false },
      { isOpen: false },
      { isOpen: false },
      { isOpen: false },
      { isOpen: false },
      { isOpen: true, from: "11:00", to: "16:00" },
      { isOpen: true, from: "11:00", to: "16:00" }
    ],
    phone: "+380931934069",
    email: "info@sirius-shelter.org"
  },
  {
    title: "Patron Animal Rescue",
    url: "https://patron-rescue.com.ua",
    addressUrl: "https://goo.gl/maps/example1",
    imageUrl: "https://ftp.goit.study/img/petsfriends/3.webp",
    address: "15 Velyka Vasylkivska Street, Kyiv, 03150",
    workDays: [
      { isOpen: true, from: "10:00", to: "18:00" },
      { isOpen: true, from: "10:00", to: "18:00" },
      { isOpen: true, from: "10:00", to: "18:00" },
      { isOpen: true, from: "10:00", to: "18:00" },
      { isOpen: true, from: "10:00", to: "18:00" },
      { isOpen: true, from: "11:00", to: "15:00" },
      { isOpen: false }
    ],
    phone: "+380501234567",
    email: "contact@patron-rescue.com.ua"
  },
  {
    title: "PetCare Lviv",
    url: "https://petcare-lviv.ua",
    addressUrl: "https://goo.gl/maps/example2",
    imageUrl: "https://ftp.goit.study/img/petsfriends/4.webp",
    address: "28 Svobody Avenue, Lviv, 79000",
    workDays: [
      { isOpen: true, from: "08:00", to: "20:00" },
      { isOpen: true, from: "08:00", to: "20:00" },
      { isOpen: true, from: "08:00", to: "20:00" },
      { isOpen: true, from: "08:00", to: "20:00" },
      { isOpen: true, from: "08:00", to: "20:00" },
      { isOpen: true, from: "09:00", to: "18:00" },
      { isOpen: true, from: "09:00", to: "18:00" }
    ],
    phone: "+380322555777",
    email: "info@petcare-lviv.ua"
  },
  {
    title: "Dnipro Pet Adoption Center",
    url: "https://dnipro-pets.org",
    addressUrl: "https://goo.gl/maps/example3",
    imageUrl: "https://ftp.goit.study/img/petsfriends/5.webp",
    address: "102 Dmytra Yavornytskoho Avenue, Dnipro, 49000",
    workDays: [
      { isOpen: true, from: "09:00", to: "17:00" },
      { isOpen: true, from: "09:00", to: "17:00" },
      { isOpen: true, from: "09:00", to: "17:00" },
      { isOpen: true, from: "09:00", to: "17:00" },
      { isOpen: true, from: "09:00", to: "17:00" },
      { isOpen: false },
      { isOpen: false }
    ],
    phone: "+380567890123",
    email: "adopt@dnipro-pets.org"
  },
  {
    title: "Odesa Marine Animal Care",
    url: "https://odesa-marine-pets.com",
    addressUrl: "https://goo.gl/maps/example4",
    imageUrl: "https://ftp.goit.study/img/petsfriends/6.webp",
    address: "5 Derybasivska Street, Odesa, 65000",
    workDays: [
      { isOpen: true, from: "10:00", to: "19:00" },
      { isOpen: true, from: "10:00", to: "19:00" },
      { isOpen: true, from: "10:00", to: "19:00" },
      { isOpen: true, from: "10:00", to: "19:00" },
      { isOpen: true, from: "10:00", to: "19:00" },
      { isOpen: true, from: "10:00", to: "17:00" },
      { isOpen: true, from: "11:00", to: "16:00" }
    ],
    phone: "+380487654321",
    email: "hello@odesa-marine-pets.com"
  },
  {
    title: "Kharkiv Exotic Pets Clinic",
    url: "https://exotic-kharkiv.vet",
    addressUrl: "https://goo.gl/maps/example5",
    imageUrl: "https://ftp.goit.study/img/petsfriends/7.webp",
    address: "23 Sumska Street, Kharkiv, 61000",
    workDays: [
      { isOpen: true, from: "09:00", to: "18:00" },
      { isOpen: true, from: "09:00", to: "18:00" },
      { isOpen: true, from: "09:00", to: "18:00" },
      { isOpen: true, from: "09:00", to: "18:00" },
      { isOpen: true, from: "09:00", to: "18:00" },
      { isOpen: true, from: "10:00", to: "15:00" },
      { isOpen: false }
    ],
    phone: "+380577778899",
    email: "exotic@kharkiv.vet"
  }
];




const newsData = [
  {
    imgUrl: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800",
    title: "Revolutionary Gene Therapy Offers Hope for Dogs with Inherited Blindness",
    text: "Veterinary researchers at the University of Pennsylvania have successfully restored vision in dogs suffering from inherited retinal disease using cutting-edge gene therapy. The breakthrough treatment could pave the way for similar therapies in humans and represents a major advancement in veterinary ophthalmology.",
    date: "2024-01-15T10:30:00+0000",
    url: "https://www.sciencedaily.com/releases/2024/01/gene-therapy-dogs.htm",
    id: "science://article/gene-therapy-dogs-2024-001"
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800",
    title: "Shelter Adoption Rates Reach Record Highs Across Ukraine",
    text: "Animal shelters throughout Ukraine are reporting unprecedented adoption rates, with over 15,000 pets finding forever homes in the past quarter alone. The surge is attributed to increased awareness campaigns and the growing trend of remote work allowing more people to care for pets at home.",
    date: "2024-01-10T14:20:00+0000",
    url: "https://petadoption.org.ua/news/record-adoptions-2024",
    id: "adoption://article/ukraine-adoptions-2024-001"
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=800",
    title: "New Study Reveals Cats Can Recognize Their Names",
    text: "Japanese researchers have published groundbreaking findings showing that domestic cats can distinguish their names from other words, even when spoken by strangers. The study, involving 78 cats from homes and cat cafes, demonstrates feline cognitive abilities previously underestimated by science.",
    date: "2023-12-28T09:15:00+0000",
    url: "https://www.nature.com/articles/cat-name-recognition-2023",
    id: "nature://article/cat-cognition-2023-012"
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800",
    title: "Telemedicine for Pets: The Future of Veterinary Care is Here",
    text: "Virtual veterinary consultations have surged by 300% since 2020, offering pet owners convenient access to professional advice from home. While not replacing in-person visits for emergencies, telemedicine is proving invaluable for follow-up appointments, behavioral consultations, and minor health concerns, making veterinary care more accessible to rural communities.",
    date: "2023-12-20T11:45:00+0000",
    url: "https://www.vetmed.com/telemedicine-revolution-2023",
    id: "vetmed://article/telemedicine-pets-2023-008"
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800",
    title: "Rescued Parrot Becomes Therapy Bird, Helps Children with Autism",
    text: "A rescued African Grey parrot named Einstein has found a new calling as a therapy animal at a children's hospital in Kyiv. His remarkable ability to mimic speech and gentle demeanor have made him an invaluable companion for children with autism spectrum disorders, helping them develop communication skills and emotional connections.",
    date: "2023-12-15T13:00:00+0000",
    url: "https://therapyanimals.org.ua/einstein-parrot-story",
    id: "therapy://article/einstein-parrot-2023-005"
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800",
    title: "Understanding Your Dog's Body Language: A Complete Guide",
    text: "Animal behaviorists have compiled a comprehensive guide to canine body language, helping owners better understand their pets' emotional states. From tail positions to ear movements, recognizing these subtle cues can prevent behavioral issues and strengthen the human-animal bond. The guide is now available free online for all pet owners.",
    date: "2023-12-08T10:00:00+0000",
    url: "https://www.dogbehavior.org/body-language-guide-2023",
    id: "behavior://article/dog-body-language-2023-011"
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800",
    title: "Microchipping Campaign Reunites Over 500 Lost Pets with Families",
    text: "A nationwide microchipping initiative launched six months ago has already resulted in over 500 successful reunions between lost pets and their worried owners. Veterinarians are urging all pet owners to microchip their animals, as it remains the most reliable method of identification when pets go missing.",
    date: "2023-11-30T15:30:00+0000",
    url: "https://microchip.org.ua/success-stories-2023",
    id: "microchip://article/reunion-campaign-2023-007"
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800",
    title: "The Rise of Urban Beekeeping: How City Dwellers Are Saving Pollinators",
    text: "Urban beekeeping has become a growing trend in major Ukrainian cities, with rooftop hives appearing on apartment buildings and community gardens. These amateur apiarists are not only producing local honey but also playing a crucial role in supporting pollinator populations and raising awareness about environmental conservation.",
    date: "2023-11-22T12:00:00+0000",
    url: "https://www.urbanfarming.ua/beekeeping-trend-2023",
    id: "urban://article/beekeeping-cities-2023-004"
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=800",
    title: "Senior Dogs Deserve Love Too: Adoption Campaign Focuses on Older Pets",
    text: "A heartwarming campaign called 'Golden Years, Golden Hearts' is encouraging people to adopt senior dogs from shelters. While puppies often get adopted quickly, older dogs frequently spend years waiting for homes. The campaign highlights the many benefits of adopting senior pets, including their calm temperament and established personalities.",
    date: "2023-11-15T09:30:00+0000",
    url: "https://seniordogs.org.ua/golden-hearts-campaign",
    id: "adoption://article/senior-dogs-2023-009"
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1444212477490-ca407925329e?w=800",
    title: "Exotic Pet Ownership: What You Need to Know Before Bringing Home a Reptile",
    text: "As interest in exotic pets grows, veterinarians are emphasizing the importance of proper research and preparation. Reptiles, amphibians, and other exotic animals have specific environmental and dietary needs that differ drastically from traditional pets. This comprehensive guide covers everything from habitat setup to legal considerations for prospective exotic pet owners.",
    date: "2023-11-08T14:15:00+0000",
    url: "https://exoticpets.vet/ownership-guide-2023",
    id: "exotic://article/reptile-ownership-2023-006"
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800",
    title: "Feline Diabetes on the Rise: Prevention and Management Strategies",
    text: "Veterinary endocrinologists are reporting an increase in feline diabetes cases, largely attributed to obesity and sedentary lifestyles. However, with proper diet, exercise, and medical management, diabetic cats can live long, healthy lives. Early detection through regular veterinary check-ups is crucial for successful treatment outcomes.",
    date: "2023-10-30T11:00:00+0000",
    url: "https://www.felinehealth.org/diabetes-prevention-2023",
    id: "health://article/feline-diabetes-2023-010"
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=800",
    title: "Community Cat Programs Reduce Stray Populations Humanely",
    text: "Trap-Neuter-Return (TNR) programs implemented in several Ukrainian cities have successfully reduced stray cat populations while improving the health of community cat colonies. These humane initiatives involve trapping stray cats, spaying or neutering them, and returning them to their territories, preventing future generations of homeless kittens.",
    date: "2023-10-20T10:45:00+0000",
    url: "https://www.tnr-ukraine.org/program-success-2023",
    id: "community://article/tnr-programs-2023-003"
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1452857297128-d9c29adba80b?w=800",
    title: "Pet Insurance Explained: Is It Worth the Investment?",
    text: "With veterinary care costs rising, more pet owners are considering pet insurance. Financial experts and veterinarians break down the pros and cons of various pet insurance plans, helping owners make informed decisions about protecting their pets' health while managing their budgets. The article includes comparison charts and real-life case studies.",
    date: "2023-10-12T13:20:00+0000",
    url: "https://www.petfinance.com/insurance-guide-2023",
    id: "finance://article/pet-insurance-2023-002"
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800",
    title: "The Healing Power of Pets: How Animals Support Mental Health",
    text: "Mental health professionals are increasingly recognizing the therapeutic benefits of pet ownership. Studies show that interacting with animals can reduce stress, anxiety, and depression while increasing levels of oxytocin and serotonin. This article explores the science behind animal-assisted therapy and shares inspiring stories of pets who've helped their owners through difficult times.",
    date: "2023-10-05T09:00:00+0000",
    url: "https://www.mentalhealth.org/pets-therapy-2023",
    id: "therapy://article/mental-health-pets-2023-001"
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800",
    title: "Sustainable Pet Care: Eco-Friendly Products and Practices",
    text: "Environmentally conscious pet owners are seeking sustainable alternatives to traditional pet products. From biodegradable waste bags to organic food and eco-friendly toys, the green pet care market is booming. This guide reviews the best sustainable pet products and offers tips for reducing your pet's environmental pawprint without compromising their health or happiness.",
    date: "2023-09-28T12:30:00+0000",
    url: "https://www.ecopets.org/sustainable-care-2023",
    id: "eco://article/sustainable-pet-care-2023-013"
  }
];

const usersData = [
  {
    name: "Olena Kovalenko",
    email: "olena.kovalenko@example.com",
    password: "Password123!",
    phone: "+380501234567",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    name: "Dmytro Shevchenko",
    email: "dmytro.shevchenko@example.com",
    password: "Password123!",
    phone: "+380672345678",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    name: "Iryna Bondarenko",
    email: "iryna.bondarenko@example.com",
    password: "Password123!",
    phone: "+380933456789",
    avatar: "https://i.pravatar.cc/150?img=3"
  },
  {
    name: "Andriy Melnyk",
    email: "andriy.melnyk@example.com",
    password: "Password123!",
    phone: "+380504567890",
    avatar: "https://i.pravatar.cc/150?img=4"
  },
  {
    name: "Natalia Tkachenko",
    email: "natalia.tkachenko@example.com",
    password: "Password123!",
    phone: "+380675678901",
    avatar: "https://i.pravatar.cc/150?img=5"
  }
];


const generateNoticesData = (locationIds, userIds) => [
  {
    species: "dog",
    category: "sell",
    price: 250,
    title: "Adorable Golden Retriever Puppies Ready for Their Forever Homes",
    name: "Charlie",
    birthday: "2023-10-15",
    comment: "Beautiful, healthy Golden Retriever puppies looking for loving families. These sweet pups have been raised in a family environment with children and are well-socialized. They are playful, affectionate, and will make wonderful companions. Vaccinated, dewormed, and vet-checked. Parents are both purebred with excellent temperaments.",
    sex: "male",
    location: locationIds[0],
    imgURL: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800",
    user: userIds[0],
    popularity: 15
  },
  {
    species: "cat",
    category: "free",
    price: 0,
    title: "Sweet Tabby Kitten Needs a Loving Home",
    name: "Luna",
    birthday: "2023-11-20",
    comment: "This precious tabby kitten was found abandoned in a park and has been in foster care for the past month. She's incredibly affectionate, loves to cuddle, and gets along great with other cats. Luna is litter-trained, healthy, and ready to bring joy to her new family. She deserves a second chance at happiness!",
    sex: "female",
    location: locationIds[1],
    imgURL: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800",
    user: userIds[1],
    popularity: 23
  },
  {
    species: "dog",
    category: "lost",
    price: 0,
    title: "URGENT: Lost Husky in Dnipro Area - Please Help!",
    name: "Storm",
    birthday: "2020-03-10",
    comment: "Our beloved Siberian Husky went missing on January 10th near the Dnipro embankment. He's a friendly male with striking blue eyes and distinctive black and white markings. Storm is microchipped and was wearing a red collar. He's very important to our family, especially our children. If you've seen him or have any information, please contact us immediately. Reward offered!",
    sex: "male",
    location: locationIds[2],
    imgURL: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800",
    user: userIds[2],
    popularity: 8
  },
  {
    species: "bird",
    category: "found",
    price: 0,
    title: "Found: Beautiful Green Parrot in Odesa",
    name: "Unknown",
    birthday: "2018-01-01",
    comment: "Found this gorgeous green parrot near Derybasivska Street yesterday evening. The bird seems well-cared for and is clearly someone's beloved pet. Very talkative and friendly, knows several phrases. Currently being kept safe and fed. If this is your parrot, please contact me with a description to verify ownership. Let's reunite this beautiful bird with its family!",
    sex: "unknown",
    location: locationIds[3],
    imgURL: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800",
    user: userIds[3],
    popularity: 12
  },
  {
    species: "cat",
    category: "sell",
    price: 400,
    title: "Purebred British Shorthair Kittens Available",
    name: "Oliver",
    birthday: "2023-12-01",
    comment: "Stunning British Shorthair kittens from champion bloodlines. These kittens have the classic round faces, plush coats, and gentle temperaments the breed is known for. Raised in our home with lots of love and attention. They come with full pedigree papers, first vaccinations, health certificate, and a starter kit. Perfect for families or individuals looking for a calm, affectionate companion.",
    sex: "male",
    location: locationIds[4],
    imgURL: "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=800",
    user: userIds[4],
    popularity: 19
  },
  {
    species: "dog",
    category: "free",
    price: 0,
    title: "Gentle Senior Dog Seeking Retirement Home",
    name: "Buddy",
    birthday: "2015-05-20",
    comment: "Meet Buddy, a 8-year-old Labrador mix who deserves to spend his golden years in a loving home. His previous owner passed away, and he's been in a shelter for 3 months. Buddy is calm, house-trained, and great with people of all ages. He enjoys leisurely walks and afternoon naps. While he may be older, he still has so much love to give. Could you be the one to give Buddy the peaceful retirement he deserves?",
    sex: "male",
    location: locationIds[0],
    imgURL: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800",
    user: userIds[0],
    popularity: 31
  },
  {
    species: "turtle",
    category: "sell",
    price: 80,
    title: "Red-Eared Slider Turtle with Complete Setup",
    name: "Shelly",
    birthday: "2021-07-15",
    comment: "Healthy red-eared slider turtle looking for a new home due to relocation. Comes with a complete 40-gallon tank setup including filter, heater, basking platform, UV lamp, and all accessories. Shelly is active, eats well, and has been well-cared for. Great for someone interested in keeping an aquatic turtle. All equipment included in the price!",
    sex: "female",
    location: locationIds[5],
    imgURL: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=800",
    user: userIds[1],
    popularity: 7
  },
  {
    species: "cat",
    category: "lost",
    price: 0,
    title: "Missing: Orange Tabby Cat in Zaporizhzhia",
    name: "Marmalade",
    birthday: "2019-08-12",
    comment: "Our orange tabby cat Marmalade has been missing since January 8th. He's an indoor cat who accidentally got out. Very friendly and may approach people. He has a distinctive white patch on his chest and white paws. Marmalade is neutered and microchipped. Our family is heartbroken without him. Please check your garages and sheds. Any information would be greatly appreciated!",
    sex: "male",
    location: locationIds[6],
    imgURL: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=800",
    user: userIds[2],
    popularity: 5
  },
  {
    species: "dog",
    category: "sell",
    price: 180,
    title: "Energetic Border Collie Puppy - Perfect for Active Families",
    name: "Dash",
    birthday: "2023-11-05",
    comment: "Intelligent and energetic Border Collie puppy ready for an active home. Border Collies are known for their intelligence and trainability - perfect for agility, herding, or as a running companion. Dash has already started basic training and is eager to learn. He needs a family that can provide plenty of exercise and mental stimulation. Comes with vaccination records and training guide.",
    sex: "male",
    location: locationIds[7], // Ivano-Frankivsk
    imgURL: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=800",
    user: userIds[3],
    popularity: 14
  },
  {
    species: "bird",
    category: "sell",
    price: 120,
    title: "Hand-Raised Cockatiel Pair - Very Friendly",
    name: "Sunny & Sky",
    birthday: "2023-06-20",
    comment: "Bonded pair of hand-raised cockatiels looking for a home together. Both birds are extremely friendly, love to whistle, and enjoy human interaction. They come with a large cage, toys, and food supplies. Cockatiels make wonderful pets and these two are particularly social and entertaining. Perfect for someone wanting interactive, musical companions!",
    sex: "multiple",
    location: locationIds[8], // Poltava
    imgURL: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800",
    user: userIds[4],
    popularity: 11
  },
  {
    species: "cat",
    category: "free",
    price: 0,
    title: "Shy but Sweet Black Cat Looking for Patient Owner",
    name: "Shadow",
    birthday: "2022-04-15",
    comment: "Shadow is a beautiful black cat who was rescued from the streets. She's initially shy but warms up to become incredibly affectionate. She would do best in a quiet home without small children, where she can take her time to adjust. Once she trusts you, she's a loyal and loving companion. Shadow is spayed, vaccinated, and ready for her forever home. Black cats are often overlooked, but they bring just as much love!",
    sex: "female",
    location: locationIds[9], // Chernihiv
    imgURL: "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=800",
    user: userIds[0],
    popularity: 9
  },
  {
    species: "dog",
    category: "found",
    price: 0,
    title: "Found: Small White Dog Near Vinnytsia Train Station",
    name: "Unknown",
    birthday: "2020-01-01",
    comment: "Found this small white fluffy dog wandering near the train station on January 12th. She appears to be well-groomed and is clearly someone's pet. Very friendly and well-behaved, seems to know basic commands. No collar or tags. Currently being cared for at a local vet clinic. If this is your dog or you know who she belongs to, please contact us with identifying details.",
    sex: "female",
    location: locationIds[10], // Vinnytsia
    imgURL: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800",
    user: userIds[1],
    popularity: 6
  },
  {
    species: "fish",
    category: "sell",
    price: 50,
    title: "Beautiful Betta Fish Collection with Tanks",
    name: "Multiple",
    birthday: "2023-08-01",
    comment: "Downsizing my betta fish collection. Offering 5 beautiful betta fish (various colors) with individual 5-gallon tanks, filters, and heaters. Each fish has been well-cared for and is healthy and active. Bettas are stunning, low-maintenance pets perfect for small spaces. All equipment is in excellent condition. Can sell individually or as a complete collection at a discount.",
    sex: "multiple",
    location: locationIds[11], // Mykolaiv
    imgURL: "https://images.unsplash.com/photo-1520990269108-4f2d8b4a6711?w=800",
    user: userIds[2],
    popularity: 4
  },
  {
    species: "dog",
    category: "free",
    price: 0,
    title: "Loving Mixed Breed Dog Needs New Home Due to Allergies",
    name: "Bella",
    birthday: "2021-09-10",
    comment: "It breaks our hearts, but we must rehome our beloved Bella due to our daughter's severe allergies. She's a medium-sized mixed breed, incredibly gentle and loving. Bella is great with kids, house-trained, and knows basic commands. She loves walks, playing fetch, and cuddling on the couch. We're looking for a responsible family who will love her as much as we do. Comes with all her belongings.",
    sex: "female",
    location: locationIds[12], // Ternopil
    imgURL: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800",
    user: userIds[3],
    popularity: 27
  },
  {
    species: "cat",
    category: "sell",
    price: 300,
    title: "Elegant Siamese Kittens - Traditional Seal Point",
    name: "Sapphire",
    birthday: "2023-12-10",
    comment: "Gorgeous traditional Siamese kittens with striking blue eyes and classic seal point coloring. These kittens are from a reputable breeder and come with full documentation. Siamese cats are known for their intelligence, vocal nature, and strong bonds with their owners. These babies are playful, curious, and already showing their distinctive personalities. Includes health guarantee and lifetime breeder support.",
    sex: "female",
    location: locationIds[13], // Chernivtsi
    imgURL: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800",
    user: userIds[4],
    popularity: 16
  },
  {
    species: "dog",
    category: "lost",
    price: 0,
    title: "LOST: Small Beagle Mix in Sumy - Family Desperate",
    name: "Cooper",
    birthday: "2019-11-25",
    comment: "Our small beagle mix Cooper has been missing since January 5th in the Sumy area. He's brown and white, about 12kg, with long floppy ears. Cooper is very friendly but may be scared. He's wearing a blue collar with our phone number. He's part of our family and we miss him terribly. Please, if you've seen him or have any information, contact us day or night. Substantial reward for his safe return!",
    sex: "male",
    location: locationIds[14], // Sumy
    imgURL: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800",
    user: userIds[0],
    popularity: 10
  },
  {
    species: "cat",
    category: "free",
    price: 0,
    title: "Bonded Cat Siblings Must Stay Together",
    name: "Milo & Mia",
    birthday: "2023-05-15",
    comment: "These two adorable siblings have been together since birth and must be adopted as a pair. Milo (orange tabby) and Mia (calico) are inseparable - they play together, groom each other, and sleep curled up side by side. Both are friendly, litter-trained, and spayed/neutered. They would thrive in a loving home where they can stay together. Adopting two cats is actually easier than one - they keep each other company!",
    sex: "multiple",
    location: locationIds[1], // Lviv
    imgURL: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800",
    user: userIds[1],
    popularity: 22
  },
  {
    species: "bird",
    category: "free",
    price: 0,
    title: "Rescued Budgie Needs Experienced Bird Owner",
    name: "Tweety",
    birthday: "2022-03-01",
    comment: "This sweet budgie was rescued from a neglectful situation and is looking for an experienced bird owner who can provide proper care. Tweety is healthy now but needs someone patient and knowledgeable about bird behavior. She's starting to trust people again and shows great potential. Comes with a cage and supplies. If you have experience with birds and a gentle touch, Tweety could be your perfect companion.",
    sex: "female",
    location: locationIds[4], // Kharkiv
    imgURL: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800",
    user: userIds[2],
    popularity: 3
  },
  {
    species: "dog",
    category: "sell",
    price: 350,
    title: "Champion Bloodline German Shepherd Puppies",
    name: "Rex",
    birthday: "2023-11-28",
    comment: "Exceptional German Shepherd puppies from champion bloodlines. Both parents are titled in conformation and have excellent temperaments. These puppies are being raised using Early Neurological Stimulation and are well-socialized. Perfect for families, working homes, or show prospects. Comes with extensive health testing, microchip, registration papers, and a comprehensive puppy package. Serious inquiries only.",
    sex: "male",
    location: locationIds[0], // Kyiv
    imgURL: "https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=800",
    user: userIds[3],
    popularity: 20
  },
  {
    species: "cat",
    category: "found",
    price: 0,
    title: "Found: Friendly Gray Cat with Green Eyes",
    name: "Unknown",
    birthday: "2021-01-01",
    comment: "Found this beautiful gray cat with striking green eyes in our neighborhood. She's very friendly and well-fed, clearly belongs to someone. No collar but appears to be spayed. She's been hanging around our porch for three days. We're keeping her safe indoors for now. If this is your cat, please contact us with a description or photo to verify. Let's get this sweet girl back home!",
    sex: "female",
    location: locationIds[2], // Dnipro
    imgURL: "https://images.unsplash.com/photo-1573865526739-10c1d3a1f0cc?w=800",
    user: userIds[4],
    popularity: 13
  }
];


// Main seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!\n');

    // Clear existing data if --clear flag is provided
    if (shouldClearData) {
      console.log('🗑️  Clearing existing data...');
      await User.deleteMany({});
      await Location.deleteMany({});
      await Friend.deleteMany({});
      await News.deleteMany({});
      await Notice.deleteMany({});
      console.log('✅ Existing data cleared!\n');
    }

    // Seed Locations
    console.log('📍 Seeding Locations...');
    const locations = await Location.insertMany(locationsData);
    console.log(`✅ Created ${locations.length} locations\n`);

    // Seed Users
    console.log('👥 Seeding Users...');
    const usersWithHashedPasswords = await Promise.all(
      usersData.map(async (userData) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        return {
          ...userData,
          password: hashedPassword
        };
      })
    );
    const users = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ Created ${users.length} users\n`);

    // Seed Friends
    console.log('🤝 Seeding Friends...');
    const friends = await Friend.insertMany(friendsData);
    console.log(`✅ Created ${friends.length} friends/partners\n`);

    // Seed News
    console.log('📰 Seeding News...');
    const news = await News.insertMany(newsData);
    console.log(`✅ Created ${news.length} news articles\n`);

    // Seed Notices
    console.log('🐾 Seeding Notices...');
    const locationIds = locations.map(loc => loc._id);
    const userIds = users.map(user => user._id);
    const noticesData = generateNoticesData(locationIds, userIds);
    const notices = await Notice.insertMany(noticesData);
    console.log(`✅ Created ${notices.length} notices\n`);

    // Summary
    console.log('═══════════════════════════════════════');
    console.log('🎉 DATABASE SEEDING COMPLETED!');
    console.log('═══════════════════════════════════════');
    console.log(`📍 Locations:  ${locations.length}`);
    console.log(`👥 Users:      ${users.length}`);
    console.log(`🤝 Friends:    ${friends.length}`);
    console.log(`📰 News:       ${news.length}`);
    console.log(`🐾 Notices:    ${notices.length}`);
    console.log('═══════════════════════════════════════\n');

    console.log('📝 Test User Credentials:');
    console.log('Email: olena.kovalenko@example.com');
    console.log('Password: Password123!\n');

    console.log('💡 You can now:');
    console.log('   - Start the server: npm start');
    console.log('   - Test GET /cities/?keyword=Kyiv');
    console.log('   - Test GET /friends/');
    console.log('   - Test GET /news');
    console.log('   - Test GET /notices');
    console.log('   - Login and test protected endpoints\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the seed function
console.log('');
console.log('╔═══════════════════════════════════════╗');
console.log('║   PetLove Database Seeding Script    ║');
console.log('╚═══════════════════════════════════════╝');
console.log('');

if (shouldClearData) {
  console.log('⚠️  WARNING: --clear flag detected!');
  console.log('⚠️  All existing data will be deleted!\n');
}

seedDatabase();
