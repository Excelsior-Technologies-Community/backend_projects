import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft,
  Play, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Star,
  Award,
  ShieldCheck,
  TrendingUp,
  Dumbbell,
  Heart,
  ArrowLeftRight,
  Eye,
  ShoppingCart,
  Check
} from 'lucide-react';
import { useCartWishlist } from '../context/AppContext';
import { ProductPreviewModal } from '../components/ProductPreviewModal';
import in1 from '../assets/in1.webp';
import in2 from '../assets/in2.webp';
import in3 from '../assets/in3.webp';
import in4 from '../assets/in4.webp';
import in5 from '../assets/in5.webp';
import in6 from '../assets/in6.webp';
import in7 from '../assets/in7.webp';
import homeBannerImg from '../assets/home-banner.webp';
import membershipBannerImg from '../assets/memberahip-subs-banner.webp';
import womanWorkoutImg from '../assets/subs-banner-2.webp';
import proImg1 from '../assets/pro-img-1.avif';
import proImg2 from '../assets/pro-img-2.avif';
import blog2Img from '../assets/blog2.webp';
import blogImg2 from '../assets/blog-img-2_f7a6f9d2-8e11-411a-a63e-c33916afd3f3.avif';
import review1 from '../assets/review-img-1.avif'
import review2 from '../assets/review-img-2.avif'
import review3 from '../assets/review-img-3.avif'
import review4 from '../assets/review-img-3_0ceb225f-ad33-438e-92b2-160d0f7485f0.webp'
import review5 from '../assets/review-img-4.avif'
import review6 from '../assets/review-img-4_93930adc-9223-46f0-9aec-9965ba396167.webp'
import card1 from '../assets/002.avif'
import card2 from '../assets/001.webp'
import articleImg1 from '../assets/1.webp';
import articleImg2 from '../assets/2.webp';
import articleImg3 from '../assets/3.webp';
import articleImg4 from '../assets/4.webp';
import articleImg5 from '../assets/5.webp';
import it003 from '../assets/003.webp'

export const HomePage = ({ setTab, products, categories, onSelectProduct, onSelectCategory }) => {
  // Personal Trainings Training Programs Slider Data
  const personalTrainings = [
    {
      id: 'train-1',
      subtitle: 'BEST ONLINE',
      title: 'YOGA & PILATES',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
      description: 'Yoga is much more than physical exercise. It is a practice that connects you to your inner self, allowing you to cultivate mindfulness, awareness, an...'
    },
    {
      id: 'train-2',
      subtitle: 'BEST ONLINE',
      title: 'CARDIO & WORKOUT',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      description: 'Our cardio workout theme is designed to help you elevate your heart rate, boost your endurance, and achieve new levels of fitness and strengths..'
    },
    {
      id: 'train-3',
      subtitle: 'BEST ONLINE',
      title: 'POWER & STRENGTH',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
      description: 'Our personal trainers are not just fitness enthusiasts; they are certified professionals with extensive knowledge in exercise science, which...'
    },
    {
      id: 'train-4',
      subtitle: 'BEST ONLINE',
      title: 'JUMPING JACKS',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      description: 'Every corner of our facility is thoughtfully designed to maximize your training experience, ensuring that you have access to the tools necessar...'
    },
    {
      id: 'train-5',
      subtitle: 'BEST ONLINE',
      title: 'BODYBUILDING PRO',
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
      description: 'Progressive overload regimes and compound barbell movements designed for hypertrophy, vascularity, and contest-ready conditioning...'
    },
    {
      id: 'train-6',
      subtitle: 'BEST ONLINE',
      title: 'HIIT & FAT BURN',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
      description: 'High intensity interval intervals tailored to incinerate visceral body fat while protecting lean muscle mass and boosting VO2 max...'
    }
  ];

  // Carousel Slider State
  const [sliderIndex, setSliderIndex] = useState(0);
  const itemsPerPage = 4;
  const maxIndex = Math.max(0, personalTrainings.length - itemsPerPage);

  // Membership Passes Data (Replicating exact layout from Shopify store)
  const membershipPasses = [
    {
      id: 'pass-month',
      badge: 'RECOMMENDED BY USERS',
      title: '1 MONTH PASS',
      image: proImg1,
      description: "Together, you'll celebrate achievements, motivate each other,",
      price: '$54.90'
    },
    {
      id: 'pass-week',
      badge: null,
      title: '1 WEEK PASS',
      image: proImg2,
      description: "Let the rhythm of your heartbeat guide you as you experience",
      price: '$14.90'
    }
  ];

  // Client Testimonials Reviews Slider Data (From Screenshots 1, 2, 3)
  const clientReviews = [
    {
      id: 'rev-1',
      rating: 4.1,
      title: 'Fantastic!',
      text: "I love the way yoga helps me to connect with my body and my breath. It's also a great way to relieve stress an...",
      author: 'Jane',
      role: 'Client',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      image: review1,
      isFeatured: false
    },
    {
      id: 'rev-2',
      rating: 4.1,
      title: 'Terrific work',
      text: 'I started yoga to help with my back pain, but I quickly realized how much it was helping me in other ways too.',
      author: 'Mary',
      role: 'Client',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      image: review2,
      isFeatured: true // Featured highlighted yellow card
    },
    {
      id: 'rev-3',
      rating: 4.1,
      title: 'Outstanding',
      text: "I feel more relaxed and at peace, and I have more energy. I'm also sleeping better than I have in years.",
      author: 'David',
      role: 'Client',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      image: review3,
      isFeatured: false
    },
    {
      id: 'rev-4',
      rating: 4.1,
      title: 'Excellent work',
      text: "I've been practicing yoga for a year now, and it has been one of the best decisions I've made for my health.",
      author: 'Emily',
      role: 'Client',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      image: review4,
      isFeatured: false
    },
    {
      id: 'rev-5',
      rating: 5.0,
      title: 'Remarkable Results',
      text: 'The progressive overload plans and accountability coaches transformed my conditioning completely.',
      author: 'Alex',
      role: 'Client',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      image: review5,
      isFeatured: false
    },
    {
      id: 'rev-6',
      rating: 5.0,
      title: 'Remarkable Results',
      text: 'The progressive overload plans and accountability coaches transformed my conditioning completely.',
      author: 'Alex',
      role: 'Client',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      image: review6,
      isFeatured: false
    }
  ];

  // Review Slider State & Mouse Drag
  const reviewScrollRef = useRef(null);
  const [isDraggingReview, setIsDraggingReview] = useState(false);
  const [reviewStartX, setReviewStartX] = useState(0);
  const [reviewScrollLeft, setReviewScrollLeft] = useState(0);

  const handleReviewMouseDown = (e) => {
    setIsDraggingReview(true);
    if (reviewScrollRef.current) {
      setReviewStartX(e.pageX - reviewScrollRef.current.offsetLeft);
      setReviewScrollLeft(reviewScrollRef.current.scrollLeft);
    }
  };

  const handleReviewMouseMove = (e) => {
    if (!isDraggingReview || !reviewScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - reviewScrollRef.current.offsetLeft;
    const walk = (x - reviewStartX) * 1.5;
    reviewScrollRef.current.scrollLeft = reviewScrollLeft - walk;
  };

  const handleReviewMouseUpOrLeave = () => {
    setIsDraggingReview(false);
  };

  const handleReviewTouchStart = (e) => {
    setIsDraggingReview(true);
    if (reviewScrollRef.current && e.touches[0]) {
      setReviewStartX(e.touches[0].pageX - reviewScrollRef.current.offsetLeft);
      setReviewScrollLeft(reviewScrollRef.current.scrollLeft);
    }
  };

  const handleReviewTouchMove = (e) => {
    if (!isDraggingReview || !reviewScrollRef.current || !e.touches[0]) return;
    const x = e.touches[0].pageX - reviewScrollRef.current.offsetLeft;
    const walk = (x - reviewStartX) * 1.5;
    reviewScrollRef.current.scrollLeft = reviewScrollLeft - walk;
  };

  const handleReviewPrev = () => {
    if (reviewScrollRef.current) {
      reviewScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const handleReviewNext = () => {
    if (reviewScrollRef.current) {
      reviewScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setSliderIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setSliderIndex(prev => Math.min(maxIndex, prev + 1));
  };

  // Our Partner Slider Data & Mouse Drag State
  const partners = [
    { id: 'p1', name: 'TRAINER', subtitle: 'PERSONAL' },
    { id: 'p2', name: 'TRAINER', subtitle: 'PERSONAL' },
    { id: 'p3', name: 'TRAINER', subtitle: 'PERSONAL' },
    { id: 'p4', name: 'TRAINER', subtitle: 'PERSONAL' },
    { id: 'p5', name: 'TRAINER', subtitle: 'PERSONAL' },
    { id: 'p6', name: 'TRAINER', subtitle: 'PERSONAL' },
    { id: 'p7', name: 'TRAINER', subtitle: 'PERSONAL' },
    { id: 'p8', name: 'TRAINER', subtitle: 'PERSONAL' },
    { id: 'p9', name: 'TRAINER', subtitle: 'PERSONAL' },
    { id: 'p10', name: 'TRAINER', subtitle: 'PERSONAL' },
    { id: 'p11', name: 'TRAINER', subtitle: 'PERSONAL' },
    { id: 'p12', name: 'TRAINER', subtitle: 'PERSONAL' }
  ];

  const partnerScrollRef = useRef(null);
  const [isDraggingPartner, setIsDraggingPartner] = useState(false);
  const [partnerStartX, setPartnerStartX] = useState(0);
  const [partnerScrollLeft, setPartnerScrollLeft] = useState(0);

  const handlePartnerMouseDown = (e) => {
    setIsDraggingPartner(true);
    if (partnerScrollRef.current) {
      setPartnerStartX(e.pageX - partnerScrollRef.current.offsetLeft);
      setPartnerScrollLeft(partnerScrollRef.current.scrollLeft);
    }
  };

  const handlePartnerMouseMove = (e) => {
    if (!isDraggingPartner || !partnerScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - partnerScrollRef.current.offsetLeft;
    const walk = (x - partnerStartX) * 1.5;
    partnerScrollRef.current.scrollLeft = partnerScrollLeft - walk;
  };

  const handlePartnerMouseUpOrLeave = () => {
    setIsDraggingPartner(false);
  };

  // Touch handlers for mobile/tablet swipe
  const handlePartnerTouchStart = (e) => {
    setIsDraggingPartner(true);
    if (partnerScrollRef.current && e.touches[0]) {
      setPartnerStartX(e.touches[0].pageX - partnerScrollRef.current.offsetLeft);
      setPartnerScrollLeft(partnerScrollRef.current.scrollLeft);
    }
  };

  const handlePartnerTouchMove = (e) => {
    if (!isDraggingPartner || !partnerScrollRef.current || !e.touches[0]) return;
    const x = e.touches[0].pageX - partnerScrollRef.current.offsetLeft;
    const walk = (x - partnerStartX) * 1.5;
    partnerScrollRef.current.scrollLeft = partnerScrollLeft - walk;
  };

  const handlePartnerPrev = () => {
    if (partnerScrollRef.current) {
      partnerScrollRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const handlePartnerNext = () => {
    if (partnerScrollRef.current) {
      partnerScrollRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  // Interesting Articles Slider Data & Infinite Mouse Drag State
  const articlesData = [
    {
      id: 'art-1',
      date: '25 May 2023',
      category: 'Fitness',
      title: 'Fine Casualwear...',
      image: articleImg4,
      description: 'The pursuit of power and strength should be balanced, emphasizing holistic development. Integrating physical, mental, and emotional...'
    },
    {
      id: 'art-2',
      date: '25 May 2023',
      category: 'Fitness',
      title: 'Ultimate Fit Lifestyle',
      image: articleImg3,
      description: 'Step into vibrant and dynamic training environment, where expert trainers are dedicated to helping you unlock your full-potential. The atmosphere...'
    },
    {
      id: 'art-3',
      date: '25 May 2023',
      category: 'Fitness',
      title: 'Super Training For Fit Flex',
      image: articleImg2,
      description: 'Mental strength encompasses qualities such as resilience, perseverance, determination, and focus. Emotional strength relates to the ability to...'
    },
    {
      id: 'art-4',
      date: '24 May 2023',
      category: 'Fitness',
      title: 'Be health with sufficient...',
      image: articleImg1,
      description: 'Regular exercise, proper nutrition, and consistent training regimes contribute to physical power and strength. Education, continuous learning, and...'
    },
    {
      id: 'art-5',
      date: '22 May 2023',
      category: 'Fitness',
      title: 'Power & Strength Mastery',
      image: articleImg5,
      description: 'Explore progressive resistance conditioning, functional mobility training, and hypertrophy principles designed by expert athletic coaches...'
    }
  ];

  // Triplicate list for seamless infinite wrapping in both directions
  const infiniteArticles = [...articlesData, ...articlesData, ...articlesData];

  const articleScrollRef = useRef(null);
  const [isDraggingArticle, setIsDraggingArticle] = useState(false);
  const [articleStartX, setArticleStartX] = useState(0);
  const [articleScrollLeft, setArticleScrollLeft] = useState(0);

  // Position in the middle set on initial render so user can scroll/drag left or right infinitely
  useEffect(() => {
    if (articleScrollRef.current) {
      const cardWidth = 320;
      const initialOffset = articlesData.length * cardWidth;
      articleScrollRef.current.scrollLeft = initialOffset;
    }
  }, []);

  // Infinite wrapping on scroll
  const handleArticleScroll = () => {
    if (!articleScrollRef.current) return;
    const { scrollLeft, scrollWidth } = articleScrollRef.current;
    const cardWidth = 320;
    const oneSetWidth = articlesData.length * cardWidth;

    if (scrollLeft <= 50) {
      articleScrollRef.current.scrollLeft = scrollLeft + oneSetWidth;
    } else if (scrollLeft >= scrollWidth - oneSetWidth - 50) {
      articleScrollRef.current.scrollLeft = scrollLeft - oneSetWidth;
    }
  };

  const handleArticleMouseDown = (e) => {
    setIsDraggingArticle(true);
    if (articleScrollRef.current) {
      setArticleStartX(e.pageX - articleScrollRef.current.offsetLeft);
      setArticleScrollLeft(articleScrollRef.current.scrollLeft);
    }
  };

  const handleArticleMouseMove = (e) => {
    if (!isDraggingArticle || !articleScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - articleScrollRef.current.offsetLeft;
    const walk = (x - articleStartX) * 1.5;
    articleScrollRef.current.scrollLeft = articleScrollLeft - walk;
  };

  const handleArticleMouseUpOrLeave = () => {
    setIsDraggingArticle(false);
  };

  const handleArticleTouchStart = (e) => {
    setIsDraggingArticle(true);
    if (articleScrollRef.current && e.touches[0]) {
      setArticleStartX(e.touches[0].pageX - articleScrollRef.current.offsetLeft);
      setArticleScrollLeft(articleScrollRef.current.scrollLeft);
    }
  };

  const handleArticleTouchMove = (e) => {
    if (!isDraggingArticle || !articleScrollRef.current || !e.touches[0]) return;
    const x = e.touches[0].pageX - articleScrollRef.current.offsetLeft;
    const walk = (x - articleStartX) * 1.5;
    articleScrollRef.current.scrollLeft = articleScrollLeft - walk;
  };

  const handleArticlePrev = () => {
    if (articleScrollRef.current) {
      articleScrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const handleArticleNext = () => {
    if (articleScrollRef.current) {
      articleScrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    compareList, 
    toggleCompare, 
    isInCompare, 
    compareModalOpen, 
    setCompareModalOpen, 
    showToast 
  } = useCartWishlist();

  const [previewProduct, setPreviewProduct] = useState(null);
  const [addedCartId, setAddedCartId] = useState(null);

  // Contact Form State (Image 1)
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    email: '',
    description: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.firstName || !contactForm.email) return;
    setContactSubmitted(true);
    if (showToast) showToast('Thank you! Your consultation request has been received.');
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ firstName: '', lastName: '', contact: '', email: '', description: '' });
    }, 4000);
  };

  // Bestseller Products Data (Using assets in1 to in7)
  const bestsellerProducts = [
    {
      id: 'bs-1',
      brand: 'CET',
      name: 'CET Wave 850E Cross...',
      fullName: 'CET Wave 850E Elliptical Cross Trainer',
      rating: 5,
      description: "Dual-action elliptical cross trainer with ergonomic handlebars, 8-level magnetic resistance, and LCD telemetry.",
      price: 3400,
      formattedPrice: 'Rs. 3,400.00 INR',
      comparePrice: null,
      badge: null,
      image: in1,
      images: [in1],
      specs: {
        'Resistance': '8-Level Magnetic',
        'Flywheel': '5.5 Kg Flywheel',
        'Max Weight': '110 Kg',
        'Display': 'LCD Digital Monitor'
      }
    },
    {
      id: 'bs-2',
      brand: 'Aerofit',
      name: 'Best Elliptical Cross...',
      fullName: 'Aerofit SOLE E25 Heavy-Duty Elliptical Trainer',
      rating: 5,
      description: 'Known for its durability and advanced features, this elliptical offers whisper-quiet glide and power incline.',
      price: 3000,
      formattedPrice: 'Rs. 3,000.00 INR',
      comparePrice: null,
      badge: 'New',
      image: in2,
      images: [in2],
      specs: {
        'Resistance': '20-Level Power Incline',
        'Flywheel': '9 Kg Flywheel',
        'Max Weight': '150 Kg',
        'Display': '7.5" Backlit LCD'
      }
    },
    {
      id: 'bs-3',
      brand: 'Aerofit',
      name: 'Aerofit Af 601 Es Elliptica...',
      fullName: 'Aerofit AF 601 ES Elliptical Magnetic Trainer',
      rating: 4.8,
      description: 'Elliptical trainers typically offer adjustable resistance levels to customize cardio intensity and lower joint impact.',
      price: 3400,
      formattedPrice: 'Rs. 3,400.00 INR',
      comparePrice: 3600,
      formattedComparePrice: 'Rs. 3,600.00 INR',
      badge: null,
      image: in3,
      images: [in3],
      specs: {
        'Resistance': '8-Level Tension Knob',
        'Flywheel': '6 Kg Flywheel',
        'Max Weight': '120 Kg',
        'Display': 'Speed, Distance, Pulse'
      }
    },
    {
      id: 'bs-4',
      brand: 'Precor',
      name: 'Standing Elliptical Cross...',
      fullName: 'Reach Superior Performance Standing Elliptical',
      rating: 5,
      description: 'Standing ellipticals engage both the upper and lower body, providing high calorie burn with 8-level resistance knob.',
      price: 4000,
      formattedPrice: 'Rs. 4,000.00 INR',
      comparePrice: null,
      badge: null, // Note: in4.webp already displays "SUPERIOR PERFORMANCE" graphic in the image
      image: in4,
      images: [in4],
      specs: {
        'Resistance': '8-Level Resistance Knob',
        'Flywheel': '6 Kg Flywheel',
        'Max Weight': '100 Kg',
        'Display': 'LCD Performance Monitor'
      }
    },
    {
      id: 'bs-5',
      brand: 'Reach',
      name: 'Reach Under-Desk Elliptical...',
      fullName: 'Reach Compact Under-Desk Motorized Stepper',
      rating: 4.9,
      description: 'Ultra-compact motorized under-desk exercise elliptical with bidirectional pedals, silent whisper motor and remote.',
      price: 2600,
      formattedPrice: 'Rs. 2,600.00 INR',
      comparePrice: 3100,
      formattedComparePrice: 'Rs. 3,100.00 INR',
      badge: 'Popular',
      image: in5,
      images: [in5],
      specs: {
        'Resistance': 'Motorized Multi-Speed',
        'Flywheel': 'Internal Motor Glide',
        'Max Weight': '110 Kg',
        'Display': 'Digital LED Screen'
      }
    },
    {
      id: 'bs-6',
      brand: 'MAXPRO',
      name: 'MAXPRO Precision Magnetic...',
      fullName: 'MAXPRO Precision Magnetic Elliptical Cross Trainer',
      rating: 4.8,
      description: 'Ergonomic lumbar support with silent magnetic resistance, dual-action moving handlebars and heart rate sensors.',
      price: 3800,
      formattedPrice: 'Rs. 3,800.00 INR',
      comparePrice: 4200,
      formattedComparePrice: 'Rs. 4,200.00 INR',
      badge: 'New',
      image: in6,
      images: [in6],
      specs: {
        'Resistance': 'Magnetic Adjustable',
        'Flywheel': '7 Kg Precision Wheel',
        'Max Weight': '130 Kg',
        'Display': 'Smart Console + Pulse'
      }
    },
    {
      id: 'bs-7',
      brand: 'Cockatoo',
      name: 'Cockatoo CX-100 Elliptical...',
      fullName: 'Cockatoo CX-100 Dual-Action Cross Trainer',
      rating: 4.7,
      description: 'Heavy gauge steel construction with smooth belt transmission, anti-slip ribbed pedals and target heart rate zones.',
      price: 3200,
      formattedPrice: 'Rs. 3,200.00 INR',
      comparePrice: 3600,
      formattedComparePrice: 'Rs. 3,600.00 INR',
      badge: 'Sale',
      image: in7,
      images: [in7],
      specs: {
        'Resistance': '8-Level Tension Dial',
        'Flywheel': '5.5 Kg Flywheel',
        'Max Weight': '115 Kg',
        'Display': 'Multi-Function LCD'
      }
    }
  ];

  // Triplicate array for seamless infinite looping
  const infiniteBestsellers = [...bestsellerProducts, ...bestsellerProducts, ...bestsellerProducts];

  const bestsellerScrollRef = useRef(null);
  const [isDraggingBestseller, setIsDraggingBestseller] = useState(false);
  const [bestsellerStartX, setBestsellerStartX] = useState(0);
  const [bestsellerScrollLeft, setBestsellerScrollLeft] = useState(0);
  // Track how far mouse moved to distinguish click vs drag
  const bestsellerDragDistRef = useRef(0);

  // Exact 1-card shift width (card width 290px + gap 24px = 314px)
  const BESTSELLER_STEP = 314;

  useEffect(() => {
    if (bestsellerScrollRef.current) {
      const initialOffset = bestsellerProducts.length * BESTSELLER_STEP;
      bestsellerScrollRef.current.scrollLeft = initialOffset;
    }
  }, []);

  const handleBestsellerScroll = () => {
    if (!bestsellerScrollRef.current) return;
    const { scrollLeft, scrollWidth } = bestsellerScrollRef.current;
    const oneSetWidth = bestsellerProducts.length * BESTSELLER_STEP;

    if (scrollLeft <= 50) {
      bestsellerScrollRef.current.scrollLeft = scrollLeft + oneSetWidth;
    } else if (scrollLeft >= scrollWidth - oneSetWidth - 50) {
      bestsellerScrollRef.current.scrollLeft = scrollLeft - oneSetWidth;
    }
  };

  const handleBestsellerMouseDown = (e) => {
    // Don't start drag if clicking a button or interactive element
    if (e.target.closest('button') || e.target.tagName === 'BUTTON') return;
    bestsellerDragDistRef.current = 0;
    setIsDraggingBestseller(true);
    if (bestsellerScrollRef.current) {
      setBestsellerStartX(e.pageX - bestsellerScrollRef.current.offsetLeft);
      setBestsellerScrollLeft(bestsellerScrollRef.current.scrollLeft);
    }
  };

  const handleBestsellerMouseMove = (e) => {
    if (!isDraggingBestseller || !bestsellerScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - bestsellerScrollRef.current.offsetLeft;
    const walk = (x - bestsellerStartX) * 1.5;
    bestsellerDragDistRef.current = Math.abs(walk);
    bestsellerScrollRef.current.scrollLeft = bestsellerScrollLeft - walk;
  };

  const handleBestsellerMouseUpOrLeave = () => {
    setIsDraggingBestseller(false);
    bestsellerDragDistRef.current = 0;
  };

  const handleBestsellerTouchStart = (e) => {
    bestsellerDragDistRef.current = 0;
    setIsDraggingBestseller(true);
    if (bestsellerScrollRef.current && e.touches[0]) {
      setBestsellerStartX(e.touches[0].pageX - bestsellerScrollRef.current.offsetLeft);
      setBestsellerScrollLeft(bestsellerScrollRef.current.scrollLeft);
    }
  };

  const handleBestsellerTouchMove = (e) => {
    if (!isDraggingBestseller || !bestsellerScrollRef.current || !e.touches[0]) return;
    const x = e.touches[0].pageX - bestsellerScrollRef.current.offsetLeft;
    const walk = (x - bestsellerStartX) * 1.5;
    bestsellerDragDistRef.current = Math.abs(walk);
    bestsellerScrollRef.current.scrollLeft = bestsellerScrollLeft - walk;
  };

  // 1 card shift on left/right click
  const handleBestsellerPrev = () => {
    if (bestsellerScrollRef.current) {
      bestsellerScrollRef.current.scrollBy({ left: -BESTSELLER_STEP, behavior: 'smooth' });
    }
  };

  const handleBestsellerNext = () => {
    if (bestsellerScrollRef.current) {
      bestsellerScrollRef.current.scrollBy({ left: BESTSELLER_STEP, behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-fade" style={{ background: '#000000', color: '#ffffff', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* =========================================================================
          1. HERO SECTION (Using client/src/assets/home-banner.webp)
         ========================================================================= */}
      <section style={{
        position: 'relative',
        minHeight: '700px',
        display: 'flex',
        alignItems: 'center',
        padding: '5rem 0 10rem 0', // Ample bottom space so top half of slider rests on hero background
        backgroundImage: `url(${homeBannerImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
        backgroundRepeat: 'no-repeat',
        zIndex: 10
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
          <div style={{ maxWidth: '640px' }}>
            {/* Small Top Subtitle */}
            <div style={{
              color: '#d4ff00',
              fontWeight: 800,
              fontSize: '0.85rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              marginBottom: '1rem'
            }}>
              BEST ONLINE
            </div>

            {/* Main Headline with Highlighted Yellow Box */}
            <h1 style={{
              fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
              fontWeight: 900,
              lineHeight: 1.08,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              marginBottom: '1.5rem',
              textTransform: 'uppercase'
            }}>
              PERSONAL{' '}
              <span style={{
                display: 'inline-block',
                background: '#d4ff00',
                color: '#000000',
                padding: '0.15rem 0.6rem',
                transform: 'rotate(-2deg)',
                fontWeight: 900,
                fontSize: '0.45em',
                verticalAlign: 'middle',
                letterSpacing: '0.05em',
                marginLeft: '8px',
                lineHeight: 1.2
              }}>
                TRAINER
              </span>
              <br />
              SUBSCRIPTION
            </h1>

            {/* Sub-headline */}
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '1rem'
            }}>
              No matter your fitness level or goals
            </h3>

            {/* Description Text */}
            <p style={{
              color: 'rgba(255, 255, 255, 0.75)',
              fontSize: '0.95rem',
              lineHeight: 1.65,
              marginBottom: '2.5rem',
              maxWidth: '520px'
            }}>
              Welcome to the world of personalized fitness guidance and motivation! Our personal trainer theme is designed to empower and inspire individuals to reach their fitness goals, regardless of their current fitness level.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* READ MORE Button */}
              <button
                onClick={() => setTab('memberships')}
                style={{
                  background: '#d4ff00',
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '0.88rem',
                  letterSpacing: '0.05em',
                  padding: '0.85rem 1.6rem',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                <span>READ MORE</span>
                <div style={{
                  border: '1px dashed #000000',
                  padding: '2px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ArrowRight size={13} strokeWidth={3} />
                </div>
              </button>

              {/* WATCH TRIAL TRAINING Button */}
              <button
                onClick={() => setTab('shop')}
                style={{
                  background: 'rgba(20, 20, 20, 0.85)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  letterSpacing: '0.05em',
                  padding: '0.85rem 1.6rem',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                <span>WATCH TRIAL TRAINING</span>
                <Play size={14} fill="#ffffff" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. PERSONAL TRAININGS SLIDER (Bridging Hero and Membership sections)
         ========================================================================= */}
      <section style={{
        position: 'relative',
        zIndex: 30,
        marginTop: '-7rem', // Pulls top half of slider cards over Hero background
        marginBottom: '-13rem' // Allows Membership section background to tuck under bottom half of slider
      }}>
        <div className="container">
          {/* Section Header */}
          <div style={{ marginBottom: '1.8rem' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase'
            }}>
              PERSONAL TRAININGS
            </h2>
          </div>

          {/* Slider Container with Left & Right Arrow Buttons */}
          <div style={{ position: 'relative' }}>
            {/* Left Nav Arrow Button */}
            <button
              onClick={handlePrev}
              disabled={sliderIndex === 0}
              style={{
                position: 'absolute',
                left: '-16px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 40,
                width: '36px',
                height: '36px',
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '0px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: sliderIndex === 0 ? 'not-allowed' : 'pointer',
                opacity: sliderIndex === 0 ? 0.35 : 1,
                boxShadow: '0 4px 15px rgba(0,0,0,0.6)'
              }}
              title="Previous training"
            >
              <ChevronLeft size={20} strokeWidth={3} />
            </button>

            {/* Right Nav Arrow Button */}
            <button
              onClick={handleNext}
              disabled={sliderIndex >= maxIndex}
              style={{
                position: 'absolute',
                right: '-16px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 40,
                width: '36px',
                height: '36px',
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '0px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: sliderIndex >= maxIndex ? 'not-allowed' : 'pointer',
                opacity: sliderIndex >= maxIndex ? 0.35 : 1,
                boxShadow: '0 4px 15px rgba(0,0,0,0.6)'
              }}
              title="Next training"
            >
              <ChevronRight size={20} strokeWidth={3} />
            </button>

            {/* Cards Carousel Window */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem'
            }}>
              {personalTrainings.slice(sliderIndex, sliderIndex + itemsPerPage).map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    background: '#070707',
                    border: idx === 0 ? '1px solid #d4ff00' : '1px solid #1c1c1c',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    boxShadow: idx === 0 ? '0 0 20px rgba(212, 255, 0, 0.15)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#d4ff00';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(212, 255, 0, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = idx === 0 ? '#d4ff00' : '#1c1c1c';
                    e.currentTarget.style.boxShadow = idx === 0 ? '0 0 20px rgba(212, 255, 0, 0.15)' : 'none';
                  }}
                >
                  {/* Training Image */}
                  <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                      }}
                    />
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{
                      color: '#d4ff00',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginBottom: '0.5rem'
                    }}>
                      {item.subtitle}
                    </div>

                    <h3 style={{
                      color: '#ffffff',
                      fontSize: '1.15rem',
                      fontWeight: 900,
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                      marginBottom: '0.75rem'
                    }}>
                      {item.title}
                    </h3>

                    <p style={{
                      color: 'rgba(255, 255, 255, 0.65)',
                      fontSize: '0.82rem',
                      lineHeight: 1.6,
                      marginBottom: '1.5rem',
                      flex: 1
                    }}>
                      {item.description}
                    </p>

                    {/* Yellow READ MORE >> Button */}
                    <button
                      onClick={() => setTab('memberships')}
                      style={{
                        background: '#d4ff00',
                        color: '#000000',
                        fontWeight: 900,
                        fontSize: '0.78rem',
                        letterSpacing: '0.05em',
                        padding: '0.65rem 1rem',
                        border: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        alignSelf: 'flex-start'
                      }}
                    >
                      <span>READ MORE</span>
                      <span style={{ fontSize: '1rem', lineHeight: 1 }}>»</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2.5. MEMBERSHIP SUBSCRIPTION SECTION (Continuous background with topographic waves)
         ========================================================================= */}
      <section style={{
        position: 'relative',
        backgroundImage: `url(${membershipBannerImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#000000',
        paddingTop: '16rem', // Room for the overlapping bottom half of the Personal Trainings slider
        paddingBottom: '6rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        overflow: 'hidden',
        zIndex: 20
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center'
          }}>
            {/* Left Column: Heading, Subtitle, Text, and Read More Button */}
            <div style={{ maxWidth: '540px' }}>
              <h2 style={{
                fontSize: 'clamp(2.5rem, 4.5vw, 3.8rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                marginBottom: '1.8rem'
              }}>
                MEMBERSHIP<br />
                SUBSCRIPTION
              </h2>

              <div style={{
                fontSize: '1.2rem',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '1.2rem'
              }}>
                Join now for 7 days <span style={{ color: '#d4ff00', fontWeight: 900 }}>FREE</span> trial
              </div>

              <p style={{
                color: 'rgba(255, 255, 255, 0.75)',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                marginBottom: '2.5rem',
                maxWidth: '460px'
              }}>
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less.
              </p>

              {/* READ MORE CTA Button */}
              <button
                onClick={() => setTab('memberships')}
                style={{
                  background: '#d4ff00',
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '0.88rem',
                  letterSpacing: '0.05em',
                  padding: '0.85rem 1.6rem',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 255, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span>READ MORE</span>
                <div style={{
                  border: '1px dashed #000000',
                  padding: '2px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ArrowRight size={13} strokeWidth={3} />
                </div>
              </button>
            </div>

            {/* Right Column: 1 Month Pass & 1 Week Pass Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.8rem',
              alignItems: 'stretch'
            }}>
              {membershipPasses.map((pass) => (
                <div
                  key={pass.id}
                  style={{
                    background: '#070707',
                    border: '1px solid #1a1a1a',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    boxShadow: pass.badge ? '0 0 25px rgba(212, 255, 0, 0.12)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#d4ff00';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(212, 255, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#1a1a1a';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = pass.badge ? '0 0 25px rgba(212, 255, 0, 0.12)' : 'none';
                  }}
                >
                  {/* Top Badge Banner (e.g. RECOMMENDED BY USERS) */}
                  {pass.badge && (
                    <div style={{
                      background: '#d4ff00',
                      color: '#000000',
                      fontWeight: 900,
                      fontSize: '0.78rem',
                      letterSpacing: '0.06em',
                      padding: '0.5rem 1rem',
                      textAlign: 'center',
                      textTransform: 'uppercase'
                    }}>
                      {pass.badge}
                    </div>
                  )}

                  {/* Card Image */}
                  <div style={{
                    height: pass.badge ? '220px' : '260px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <img
                      src={pass.image}
                      alt={pass.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                    />
                  </div>

                  {/* Card Details */}
                  <div style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    background: '#070707'
                  }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      color: '#ffffff',
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                      marginBottom: '0.6rem'
                    }}>
                      {pass.title}
                    </h3>

                    <p style={{
                      color: 'rgba(255, 255, 255, 0.65)',
                      fontSize: '0.82rem',
                      lineHeight: 1.55,
                      marginBottom: '1.8rem',
                      flex: 1
                    }}>
                      {pass.description}
                    </p>

                    {/* Bottom Price & Select Button */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 'auto',
                      paddingTop: '0.85rem',
                      borderTop: '1px solid #161616'
                    }}>
                      <div style={{
                        fontSize: '1.35rem',
                        fontWeight: 900,
                        color: '#ffffff',
                        letterSpacing: '0.02em'
                      }}>
                        {pass.price}
                      </div>

                      <button
                        onClick={() => setTab('memberships')}
                        style={{
                          background: '#d4ff00',
                          color: '#000000',
                          fontWeight: 900,
                          fontSize: '0.78rem',
                          letterSpacing: '0.05em',
                          padding: '0.55rem 1.1rem',
                          border: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#e6ff40';
                          e.currentTarget.style.transform = 'scale(1.03)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#d4ff00';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <span>SELECT</span>
                        <div style={{
                          border: '1px dashed #000000',
                          padding: '1px 3px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <ArrowRight size={11} strokeWidth={3} />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3.1. HIIT & CARDIO HERO BANNER (Image 1 from user request)
         ========================================================================= */}
      <section style={{
        position: 'relative',
        minHeight: '620px',
        display: 'flex',
        alignItems: 'center',
        padding: '5rem 0 10rem 0', // Ample space for testimonials slider overlap
        backgroundImage: `url(${womanWorkoutImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 10
      }}>
        {/* Subtle Dark Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.85) 100%)',
          zIndex: 1
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ maxWidth: '580px' }}>
            {/* Main Headline */}
            <h2 style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              marginBottom: '1.2rem'
            }}>
              MEDICALERRORS<br />
              LITIGATIONS
            </h2>

            {/* Sub-headline */}
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '1.2rem',
              letterSpacing: '0.01em'
            }}>
              HIIT (High-Intensity Interval Training) workouts
            </h4>

            {/* Description Text */}
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.92rem',
              lineHeight: 1.65,
              marginBottom: '2.2rem'
            }}>
              Embrace the camaraderie and support of our cardio workout community. You'll have the opportunity to connect with fellow enthusiasts who share your passion for pushing boundaries and achieving personal milestones.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* READ MORE Button */}
              <button
                onClick={() => setTab('memberships')}
                style={{
                  background: '#d4ff00',
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  letterSpacing: '0.05em',
                  padding: '0.8rem 1.6rem',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(212, 255, 0, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>READ MORE</span>
                <div style={{
                  border: '1px dashed #000000',
                  padding: '2px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ArrowRight size={13} strokeWidth={3} />
                </div>
              </button>

              {/* WATCH TRIAL TRAINING Button */}
              <button
                onClick={() => setTab('shop')}
                style={{
                  background: 'rgba(120, 120, 120, 0.45)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  letterSpacing: '0.05em',
                  padding: '0.8rem 1.6rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  backdropFilter: 'blur(4px)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(212, 255, 0, 0.2)';
                  e.currentTarget.style.borderColor = '#d4ff00';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(120, 120, 120, 0.45)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
              >
                <span>WATCH TRIAL TRAINING</span>
                <Play size={13} fill="#ffffff" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3.2. CLIENT TESTIMONIALS REVIEWS SLIDER (Image 2 - Bridging Section 1 & 3)
         ========================================================================= */}
      <section style={{
        position: 'relative',
        zIndex: 30,
        marginTop: '-7rem', // Pulls top half of review cards over the banner background
        marginBottom: '-13rem' // Tucks Power & Strenght background underneath
      }}>
        <div className="container">
          {/* Slider Container with Monochrome Left & Right Buttons */}
          <div style={{ position: 'relative' }}>
            {/* Left Arrow Button */}
            <button
              onClick={handleReviewPrev}
              style={{
                position: 'absolute',
                left: '-16px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 40,
                width: '36px',
                height: '36px',
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '0px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#d4ff00';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
              }}
              title="Previous reviews"
            >
              <ChevronLeft size={20} strokeWidth={3} />
            </button>

            {/* Right Arrow Button */}
            <button
              onClick={handleReviewNext}
              style={{
                position: 'absolute',
                right: '-16px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 40,
                width: '36px',
                height: '36px',
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '0px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#d4ff00';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
              }}
              title="Next reviews"
            >
              <ChevronRight size={20} strokeWidth={3} />
            </button>

            {/* Reviews Cards Horizontal Slider with Mouse & Touch Drag */}
            <div
              ref={reviewScrollRef}
              className="no-scrollbar"
              onMouseDown={handleReviewMouseDown}
              onMouseMove={handleReviewMouseMove}
              onMouseUp={handleReviewMouseUpOrLeave}
              onMouseLeave={handleReviewMouseUpOrLeave}
              onTouchStart={handleReviewTouchStart}
              onTouchMove={handleReviewTouchMove}
              onTouchEnd={handleReviewMouseUpOrLeave}
              style={{
                display: 'flex',
                gap: '1.5rem',
                overflowX: 'auto',
                scrollBehavior: isDraggingReview ? 'auto' : 'smooth',
                cursor: isDraggingReview ? 'grabbing' : 'grab',
                userSelect: 'none',
                WebkitOverflowScrolling: 'touch',
                padding: '0.5rem 0.5rem 1.2rem'
              }}
            >
              {clientReviews.map((rev) => {
                const isYellow = rev.isFeatured;

                return (
                  <div
                    key={rev.id}
                    style={{
                      flex: '0 0 280px',
                      minWidth: '280px',
                      maxWidth: '300px',
                      background: isYellow ? '#d4ff00' : '#070707',
                      color: isYellow ? '#000000' : '#ffffff',
                      border: isYellow ? '1px solid #d4ff00' : '1px solid #1c1c1c',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: isDraggingReview ? 'none' : 'all 0.3s ease',
                      position: 'relative',
                      boxShadow: isYellow ? '0 0 25px rgba(212, 255, 0, 0.25)' : 'none',
                      userSelect: 'none',
                      pointerEvents: isDraggingReview ? 'none' : 'auto'
                    }}
                    onMouseEnter={(e) => {
                      if (!isYellow && !isDraggingReview) {
                        e.currentTarget.style.borderColor = '#d4ff00';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(212, 255, 0, 0.2)';
                      }
                      if (!isDraggingReview) e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isYellow && !isDraggingReview) {
                        e.currentTarget.style.borderColor = '#1c1c1c';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                      if (!isDraggingReview) e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Top Workout Image */}
                    <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={rev.image}
                        alt={rev.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>

                    {/* Review Body */}
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      {/* Rating Stars */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.8rem' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={isYellow ? '#000000' : '#d4ff00'}
                            color={isYellow ? '#000000' : '#d4ff00'}
                          />
                        ))}
                        <span style={{
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          marginLeft: '6px',
                          color: isYellow ? '#000000' : '#d4ff00'
                        }}>
                          {rev.rating}
                        </span>
                      </div>

                      {/* Review Title */}
                      <h4 style={{
                        fontSize: '1.15rem',
                        fontWeight: 900,
                        letterSpacing: '-0.01em',
                        marginBottom: '0.6rem',
                        color: isYellow ? '#000000' : '#ffffff'
                      }}>
                        {rev.title}
                      </h4>

                      {/* Review Paragraph */}
                      <p style={{
                        fontSize: '0.82rem',
                        lineHeight: 1.55,
                        marginBottom: '1.8rem',
                        flex: 1,
                        color: isYellow ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.65)'
                      }}>
                        {rev.text}
                      </p>

                      {/* Author Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto' }}>
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: isYellow ? '1.5px solid #000000' : '1.5px solid #d4ff00'
                          }}
                        />
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isYellow ? '#000000' : '#ffffff' }}>
                          {rev.author}, <span style={{ opacity: 0.75, fontWeight: 500 }}>{rev.role}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3.3. POWER & STRENGHT SECTION (Image 3 from user request)
         ========================================================================= */}
      <section style={{
        position: 'relative',
        backgroundColor: '#000000',
        paddingTop: '16rem', // Space for overlapping review slider cards
        paddingBottom: '6rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        zIndex: 20
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center'
          }}>
            {/* Left Column: Heading, Subtitle, Description, Checklist, and Button */}
            <div style={{ maxWidth: '520px' }}>
              <h2 style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                marginBottom: '1.4rem'
              }}>
                POWER &amp; STRENGHT
              </h2>

              <h4 style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '1rem'
              }}>
                Experienced cardio instructor provides instruction.
              </h4>

              <p style={{
                color: 'rgba(255, 255, 255, 0.72)',
                fontSize: '0.9rem',
                lineHeight: 1.65,
                marginBottom: '1.8rem'
              }}>
                No matter your fitness level or goals, our cardio workouts are adaptable to suit your needs. Our trainers will provide modifications and progressions, ensuring that you can challenge yourself at the right intensity and progress at a pace that is comfortable for you.
              </p>

              {/* Checklist Items with Neon Circled Arrow Icons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2.5rem' }}>
                {[
                  'Lose unnecessary kilograms.',
                  'Increase endurance and strength.',
                  'Gain new energy and willingness to train.'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      border: '1.5px solid #d4ff00',
                      color: '#d4ff00',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <ArrowRight size={11} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: '0.92rem', color: '#ffffff', fontWeight: 600 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* READ MORE Button */}
              <button
                onClick={() => setTab('memberships')}
                style={{
                  background: '#d4ff00',
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  letterSpacing: '0.05em',
                  padding: '0.8rem 1.6rem',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(212, 255, 0, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>READ MORE</span>
                <div style={{
                  border: '1px dashed #000000',
                  padding: '2px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ArrowRight size={13} strokeWidth={3} />
                </div>
              </button>
            </div>

            {/* Right Column: 2 Feature Cards (Kettlebell Swings + Video Preview) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.8rem',
              alignItems: 'stretch'
            }}>
              {/* Feature Card 1: Kettlebell Swings */}
              <div
                style={{
                  background: '#070707',
                  border: '1px solid #1c1c1c',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#d4ff00';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(212, 255, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1c1c1c';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src= {card1}
                    alt="Kettlebell swings"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{
                    color: '#d4ff00',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '0.4rem'
                  }}>
                    BEST ONLINE
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                    Kettlebell swings
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.82rem', lineHeight: 1.55, marginBottom: '1.5rem', flex: 1 }}>
                    In our yoga studio, you will find a sense of community and support. We believe in creating a non-judgmental and inclusive environment
                  </p>
                  <button
                    onClick={() => setTab('memberships')}
                    style={{
                      background: '#d4ff00',
                      color: '#000000',
                      fontWeight: 900,
                      fontSize: '0.78rem',
                      letterSpacing: '0.05em',
                      padding: '0.65rem 1rem',
                      border: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      alignSelf: 'flex-start'
                    }}
                  >
                    <span>READ MORE</span>
                    <span style={{ fontSize: '1rem', lineHeight: 1 }}>»</span>
                  </button>
                </div>
              </div>

              {/* Feature Card 2: Barbell Snatch Video Showcase */}
              <div
                style={{
                  background: '#070707',
                  border: '1px solid #1c1c1c',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '380px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setTab('shop')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#d4ff00';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(212, 255, 0, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1c1c1c';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <img
                  src={card2}
                  alt="Training Video Preview"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.35)'
                }} />
                {/* Glowing Play Circle Button */}
                <div style={{
                  position: 'relative',
                  zIndex: 2,
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  border: '2px solid #d4ff00',
                  background: 'rgba(0,0,0,0.65)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(212, 255, 0, 0.4)',
                  transition: 'transform 0.3s ease'
                }}>
                  <Play size={22} fill="#d4ff00" color="#d4ff00" style={{ marginLeft: '4px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3.4. YOGA & PILATES SECTION (Matched Asset Images & Exact Layout from Reference)
         ========================================================================= */}
      <section style={{
        position: 'relative',
        backgroundColor: '#000000',
        padding: '5rem 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        zIndex: 20
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '1.8rem',
            alignItems: 'stretch'
          }}>
            {/* COLUMN 1: Woman Holding Semper Fit Weight Plate with Play Button Overlay */}
            <div
              style={{
                position: 'relative',
                background: '#070707',
                border: '1px solid #1c1c1c',
                overflow: 'hidden',
                minHeight: '440px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setTab('shop')}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#d4ff00';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(212, 255, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1c1c1c';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <img
                src={blog2Img}
                alt="Personal training yoga and weights"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.15)'
              }} />
              
              {/* Glowing Play Circle Button */}
              <div style={{
                position: 'relative',
                zIndex: 2,
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: '2px solid #d4ff00',
                background: 'rgba(0, 0, 0, 0.75)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 22px rgba(212, 255, 0, 0.45)',
                transition: 'transform 0.3s ease'
              }}>
                <Play size={20} fill="#d4ff00" color="#d4ff00" style={{ marginLeft: '3px' }} />
              </div>
            </div>

            {/* COLUMN 2: Zumba Dance Routines (Top Image + Bottom Card) */}
            <div
              style={{
                background: '#070707',
                border: '1px solid #1c1c1c',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#d4ff00';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(212, 255, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1c1c1c';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Top Gym Training Image */}
              <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={blogImg2}
                  alt="Zumba and gym fitness routines"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Bottom Card Content */}
              <div style={{ padding: '1.6rem', display: 'flex', flexDirection: 'column', flex: 1, background: '#000000' }}>
                <div style={{
                  color: '#d4ff00',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '0.6rem'
                }}>
                  BEST ONLINE
                </div>

                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  marginBottom: '0.8rem',
                  lineHeight: 1.25
                }}>
                  Zumba dance routines
                </h3>

                <p style={{
                  color: 'rgba(255, 255, 255, 0.72)',
                  fontSize: '0.84rem',
                  lineHeight: 1.6,
                  marginBottom: '1.6rem',
                  flex: 1
                }}>
                  Studies have shown that regular exercise is associated with a longer life expectancy and a reduced risk of premature death.
                </p>

                {/* Yellow RESUME LESSONS >> Button */}
                <button
                  onClick={() => setTab('memberships')}
                  style={{
                    background: '#d4ff00',
                    color: '#000000',
                    fontWeight: 900,
                    fontSize: '0.78rem',
                    letterSpacing: '0.05em',
                    padding: '0.7rem 1.25rem',
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    alignSelf: 'flex-start',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e6ff40';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#d4ff00';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <span>RESUME LESSONS</span>
                  <span style={{ fontSize: '1rem', lineHeight: 1 }}>»</span>
                </button>
              </div>
            </div>

            {/* COLUMN 3: Yoga & Pilates Header, Subtitle, Checklist & READ MORE CTA */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingLeft: '0.6rem'
            }}>
              <h2 style={{
                fontSize: 'clamp(2.4rem, 4vw, 3.6rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                marginBottom: '1.4rem'
              }}>
                YOGA &amp; PILATES
              </h2>

              <h4 style={{
                fontSize: '1.1rem',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '1rem',
                letterSpacing: '0.01em'
              }}>
                Medicine ball exercises
              </h4>

              <p style={{
                color: 'rgba(255, 255, 255, 0.75)',
                fontSize: '0.92rem',
                lineHeight: 1.65,
                marginBottom: '1.8rem'
              }}>
                Active individuals have a lower risk of developing chronic conditions such as type 2 diabetes, certain types of cancer, and metabolic syndrome.
              </p>

              {/* Checklist Items with Neon Circled Arrow Icons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem' }}>
                {[
                  'Improved cardiovascular health.',
                  'Enhanced flexibility and balance.',
                  'Boosted mood and mental well-being.'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '1.5px solid #d4ff00',
                      color: '#d4ff00',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <ArrowRight size={10} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: '0.92rem', color: '#ffffff', fontWeight: 600 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Yellow READ MORE Button with Dashed Arrow Box */}
              <div>
                <button
                  onClick={() => setTab('memberships')}
                  style={{
                    background: '#d4ff00',
                    color: '#000000',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                    letterSpacing: '0.05em',
                    padding: '0.8rem 1.6rem',
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(212, 255, 0, 0.4)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>READ MORE</span>
                  <div style={{
                    border: '1px dashed #000000',
                    padding: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ArrowRight size={13} strokeWidth={3} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3.5. OUR PARTNER SLIDER SECTION (Matched from User Reference)
         ========================================================================= */}
      <section style={{
        backgroundColor: '#000000',
        padding: '4.5rem 0 5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
        zIndex: 20
      }}>
        <div className="container">
          {/* Centered Heading */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              margin: 0
            }}>
              OUR PARTNER
            </h2>
          </div>

          {/* Slider Container with Left & Right Nav Buttons */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.2rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Left Button */}
            <button
              onClick={handlePartnerPrev}
              style={{
                width: '38px',
                height: '38px',
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '0px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#d4ff00';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
              }}
              title="Previous partners"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
            </button>

            {/* Partners Logo Row with Mouse & Touch Drag Sliding */}
            <div
              ref={partnerScrollRef}
              className="no-scrollbar"
              onMouseDown={handlePartnerMouseDown}
              onMouseMove={handlePartnerMouseMove}
              onMouseUp={handlePartnerMouseUpOrLeave}
              onMouseLeave={handlePartnerMouseUpOrLeave}
              onTouchStart={handlePartnerTouchStart}
              onTouchMove={handlePartnerTouchMove}
              onTouchEnd={handlePartnerMouseUpOrLeave}
              style={{
                flex: 1,
                overflowX: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '2.5rem',
                padding: '0.8rem 1rem',
                cursor: isDraggingPartner ? 'grabbing' : 'grab',
                userSelect: 'none',
                scrollBehavior: isDraggingPartner ? 'auto' : 'smooth',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {partners.map((partner, idx) => (
                <div
                  key={`${partner.id}-${idx}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.8rem 1.6rem',
                    opacity: 0.9,
                    transition: isDraggingPartner ? 'none' : 'all 0.3s ease',
                    minWidth: '150px',
                    flexShrink: 0,
                    userSelect: 'none',
                    pointerEvents: isDraggingPartner ? 'none' : 'auto'
                  }}
                  onMouseEnter={(e) => {
                    if (!isDraggingPartner) {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'translateY(-3px) scale(1.06)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  }}
                >
                  <span style={{
                    fontSize: '1.45rem',
                    fontWeight: 900,
                    color: '#ffffff',
                    letterSpacing: '0.04em',
                    lineHeight: 1.1,
                    textTransform: 'uppercase'
                  }}>
                    {partner.name}
                  </span>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    color: 'rgba(255, 255, 255, 0.85)',
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    marginTop: '2px'
                  }}>
                    {partner.subtitle}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Button */}
            <button
              onClick={handlePartnerNext}
              style={{
                width: '38px',
                height: '38px',
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '0px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#d4ff00';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
              }}
              title="Next partners"
            >
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3.6. INTERESTING ARTICLES SECTION (Infinite Loop Slider on Yellow Background)
         ========================================================================= */}
      <section style={{
        backgroundColor: '#d4ff00',
        color: '#000000',
        padding: '5.5rem 0 6rem',
        position: 'relative',
        zIndex: 20,
        overflow: 'hidden'
      }}>
        <div className="container">
          {/* Section Heading & Subtitle */}
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <h2 style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              fontWeight: 900,
              color: '#000000',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              marginBottom: '0.8rem',
              lineHeight: 1.1
            }}>
              INTERESTING ARTICLES
            </h2>
            <p style={{
              color: '#000000',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              fontWeight: 500,
              opacity: 0.95
            }}>
              As you move through various yoga postures (asanas), you will learn to synchronise your breath with your movements, creating a graceful and meditative flow.
            </p>
          </div>

          {/* Infinite Loop Slider Container with Left & Right Nav Arrows */}
          <div style={{ position: 'relative' }}>
            {/* Left Nav Arrow Button */}
            <button
              onClick={handleArticlePrev}
              style={{
                position: 'absolute',
                left: '-16px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 30,
                width: '40px',
                height: '40px',
                background: '#000000',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.35)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#000000';
                e.currentTarget.style.color = '#ffffff';
              }}
              title="Previous articles"
            >
              <ChevronLeft size={22} strokeWidth={3} />
            </button>

            {/* Right Nav Arrow Button */}
            <button
              onClick={handleArticleNext}
              style={{
                position: 'absolute',
                right: '-16px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 30,
                width: '40px',
                height: '40px',
                background: '#000000',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.35)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#000000';
                e.currentTarget.style.color = '#ffffff';
              }}
              title="Next articles"
            >
              <ChevronRight size={22} strokeWidth={3} />
            </button>

            {/* Scrollable Track */}
            <div
              ref={articleScrollRef}
              className="no-scrollbar"
              onScroll={handleArticleScroll}
              onMouseDown={handleArticleMouseDown}
              onMouseMove={handleArticleMouseMove}
              onMouseUp={handleArticleMouseUpOrLeave}
              onMouseLeave={handleArticleMouseUpOrLeave}
              onTouchStart={handleArticleTouchStart}
              onTouchMove={handleArticleTouchMove}
              onTouchEnd={handleArticleMouseUpOrLeave}
              style={{
                display: 'flex',
                gap: '1.8rem',
                overflowX: 'auto',
                scrollBehavior: isDraggingArticle ? 'auto' : 'smooth',
                cursor: isDraggingArticle ? 'grabbing' : 'grab',
                userSelect: 'none',
                WebkitOverflowScrolling: 'touch',
                padding: '0.5rem 0.5rem 1.5rem'
              }}
            >
              {infiniteArticles.map((article, idx) => (
                <div
                  key={`${article.id}-${idx}`}
                  style={{
                    flex: '0 0 300px',
                    minWidth: '300px',
                    maxWidth: '320px',
                    background: '#000000',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    userSelect: 'none',
                    transition: isDraggingArticle ? 'none' : 'all 0.3s ease',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
                    pointerEvents: isDraggingArticle ? 'none' : 'auto'
                  }}
                  onMouseEnter={(e) => {
                    if (!isDraggingArticle) {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 18px 40px rgba(0, 0, 0, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDraggingArticle) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.25)';
                    }
                  }}
                >
                  {/* Article Image with Date Badge */}
                  <div style={{ height: '210px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: '#d4ff00',
                      color: '#000000',
                      fontWeight: 900,
                      fontSize: '0.75rem',
                      letterSpacing: '0.02em',
                      padding: '0.35rem 0.75rem',
                      zIndex: 2,
                      textTransform: 'none'
                    }}>
                      {article.date}
                    </div>
                    <img
                      src={article.image}
                      alt={article.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                    />
                  </div>

                  {/* Article Content */}
                  <div style={{ padding: '1.6rem', display: 'flex', flexDirection: 'column', flex: 1, background: '#000000' }}>
                    <div style={{
                      color: '#d4ff00',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      textTransform: 'capitalize',
                      marginBottom: '0.6rem'
                    }}>
                      {article.category}
                    </div>

                    <h3 style={{
                      fontSize: '1.2rem',
                      fontWeight: 900,
                      color: '#ffffff',
                      marginBottom: '0.8rem',
                      lineHeight: 1.25,
                      letterSpacing: '-0.01em'
                    }}>
                      {article.title}
                    </h3>

                    <p style={{
                      color: 'rgba(255, 255, 255, 0.72)',
                      fontSize: '0.82rem',
                      lineHeight: 1.6,
                      marginBottom: '1.6rem',
                      flex: 1
                    }}>
                      {article.description}
                    </p>

                    <button
                      onClick={() => setTab('memberships')}
                      style={{
                        background: '#d4ff00',
                        color: '#000000',
                        fontWeight: 900,
                        fontSize: '0.78rem',
                        letterSpacing: '0.05em',
                        padding: '0.7rem 1.2rem',
                        border: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        alignSelf: 'flex-start',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e6ff40';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#d4ff00';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <span>SHOW SERVICES</span>
                      <span style={{ fontSize: '1rem', lineHeight: 1 }}>»</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3.7. PERSONAL SUBSCRIPTION & CONTACT FORM SECTION (Image 1)
         ========================================================================= */}
      <section style={{
        padding: '6rem 0 5rem',
        background: '#000000',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
        zIndex: 20
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '4rem',
            alignItems: 'start'
          }}>
            {/* Left Column: Headline, Description, Read More CTA & Workout Image */}
            <div style={{ maxWidth: '540px' }}>
              <div style={{
                color: '#d4ff00',
                fontSize: '0.82rem',
                fontWeight: 800,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                marginBottom: '0.8rem'
              }}>
                BEST ONLINE
              </div>

              <h2 style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                marginBottom: '1.4rem'
              }}>
                PERSONAL<br />
                SUBSCRIPTION
              </h2>

              <div style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '1.2rem'
              }}>
                Join now for 7 days <span style={{ color: '#d4ff00', fontWeight: 900 }}>FREE</span> trial
              </div>

              <p style={{
                color: 'rgba(255, 255, 255, 0.75)',
                fontSize: '0.92rem',
                lineHeight: 1.65,
                marginBottom: '2rem',
                maxWidth: '480px'
              }}>
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum.
              </p>

              {/* READ MORE Button */}
              <button
                onClick={() => setTab('memberships')}
                style={{
                  background: '#d4ff00',
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  letterSpacing: '0.05em',
                  padding: '0.8rem 1.6rem',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  marginBottom: '2.5rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 255, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span>READ MORE</span>
                <div style={{
                  border: '1px dashed #000000',
                  padding: '2px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ArrowRight size={13} strokeWidth={3} />
                </div>
              </button>

              {/* Workout Community Photo */}
              <div style={{
                width: '100%',
                height: '240px',
                overflow: 'hidden',
                border: '1px solid #1c1c1c',
                position: 'relative'
              }}>
                <img
                  src={it003}
                  alt="Personal training athletes workout"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            </div>

            {/* Right Column: Neon Bordered Contact Form Box */}
            <div style={{
              border: '1.5px solid #d4ff00',
              background: '#000000',
              padding: '2.5rem',
              boxShadow: '0 0 30px rgba(212, 255, 0, 0.08)'
            }}>
              <h3 style={{
                color: '#ffffff',
                fontSize: '1.35rem',
                fontWeight: 800,
                letterSpacing: '-0.01em',
                marginBottom: '1.8rem'
              }}>
                Contact form:
              </h3>

              {contactSubmitted ? (
                <div style={{
                  background: 'rgba(212, 255, 0, 0.12)',
                  border: '1px solid #d4ff00',
                  color: '#d4ff00',
                  padding: '1.5rem',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '0.95rem'
                }}>
                  🎉 Thank you for your interest! A personal trainer coach will review your details and contact you within 24 hours.
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Row 1: First Name & Last Name */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1.2rem'
                  }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', marginBottom: '0.5rem', fontWeight: 600 }}>
                        First Name:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John"
                        value={contactForm.firstName}
                        onChange={(e) => setContactForm(prev => ({ ...prev, firstName: e.target.value }))}
                        style={{
                          width: '100%',
                          background: '#000000',
                          border: '1px solid #333333',
                          color: '#ffffff',
                          padding: '0.75rem 1rem',
                          fontSize: '0.88rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', marginBottom: '0.5rem', fontWeight: 600 }}>
                        Last Name:
                      </label>
                      <input
                        type="text"
                        placeholder="Dio"
                        value={contactForm.lastName}
                        onChange={(e) => setContactForm(prev => ({ ...prev, lastName: e.target.value }))}
                        style={{
                          width: '100%',
                          background: '#000000',
                          border: '1px solid #333333',
                          color: '#ffffff',
                          padding: '0.75rem 1rem',
                          fontSize: '0.88rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Row 2: Contact & E-mail */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1.2rem'
                  }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', marginBottom: '0.5rem', fontWeight: 600 }}>
                        Contact:
                      </label>
                      <input
                        type="tel"
                        placeholder="1234567890"
                        value={contactForm.contact}
                        onChange={(e) => setContactForm(prev => ({ ...prev, contact: e.target.value }))}
                        style={{
                          width: '100%',
                          background: '#000000',
                          border: '1px solid #333333',
                          color: '#ffffff',
                          padding: '0.75rem 1rem',
                          fontSize: '0.88rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', marginBottom: '0.5rem', fontWeight: 600 }}>
                        E-mail:
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="shop@company.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        style={{
                          width: '100%',
                          background: '#000000',
                          border: '1px solid #333333',
                          color: '#ffffff',
                          padding: '0.75rem 1rem',
                          fontSize: '0.88rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Row 3: Description */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', marginBottom: '0.5rem', fontWeight: 600 }}>
                      Description:
                    </label>
                    <textarea
                      rows={4}
                      placeholder="How can we help?"
                      value={contactForm.description}
                      onChange={(e) => setContactForm(prev => ({ ...prev, description: e.target.value }))}
                      style={{
                        width: '100%',
                        background: '#000000',
                        border: '1px solid #333333',
                        color: '#ffffff',
                        padding: '0.75rem 1rem',
                        fontSize: '0.88rem',
                        outline: 'none',
                        resize: 'vertical',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      style={{
                        background: '#d4ff00',
                        color: '#000000',
                        fontWeight: 900,
                        fontSize: '0.85rem',
                        letterSpacing: '0.04em',
                        padding: '0.85rem 1.8rem',
                        border: 'none',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e6ff40';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#d4ff00';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      GET CONSULTATIONS
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3.8. BESTSELLER PRODUCT INFINITE CAROUSEL SECTION (Image 2)
         ========================================================================= */}
      <section style={{
        padding: '6rem 0 7rem',
        background: '#000000',
        position: 'relative',
        zIndex: 20
      }}>
        <div className="container">
          {/* Section Header */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              margin: 0
            }}>
              BESTSELLER PRODUCT
            </h2>
          </div>

          {/* Carousel Slider Container with Left & Right Nav Arrows (1 card shift per click) */}
          <div style={{ position: 'relative' }}>
            {/* Left Nav Arrow */}
            <button
              onClick={handleBestsellerPrev}
              style={{
                position: 'absolute',
                left: '-16px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 40,
                width: '38px',
                height: '38px',
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '0px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.8)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#d4ff00';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
              }}
              title="Previous bestseller"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
            </button>

            {/* Right Nav Arrow */}
            <button
              onClick={handleBestsellerNext}
              style={{
                position: 'absolute',
                right: '-16px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 40,
                width: '38px',
                height: '38px',
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '0px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.8)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#d4ff00';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
              }}
              title="Next bestseller"
            >
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>

            {/* Bestsellers Track */}
            <div
              ref={bestsellerScrollRef}
              className="no-scrollbar"
              onScroll={handleBestsellerScroll}
              onMouseDown={handleBestsellerMouseDown}
              onMouseMove={handleBestsellerMouseMove}
              onMouseUp={handleBestsellerMouseUpOrLeave}
              onMouseLeave={handleBestsellerMouseUpOrLeave}
              onTouchStart={handleBestsellerTouchStart}
              onTouchMove={handleBestsellerTouchMove}
              onTouchEnd={handleBestsellerMouseUpOrLeave}
              style={{
                display: 'flex',
                gap: '24px',
                overflowX: 'auto',
                scrollBehavior: isDraggingBestseller ? 'auto' : 'smooth',
                cursor: isDraggingBestseller ? 'grabbing' : 'grab',
                userSelect: 'none',
                WebkitOverflowScrolling: 'touch',
                padding: '0.5rem 0.2rem 1.5rem'
              }}
            >
              {infiniteBestsellers.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  style={{
                    flex: '0 0 290px',
                    minWidth: '290px',
                    maxWidth: '300px',
                    background: '#000000',
                    border: '1px solid #1c1c1c',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    userSelect: 'none',
                    transition: isDraggingBestseller ? 'none' : 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isDraggingBestseller) {
                      e.currentTarget.style.borderColor = '#d4ff00';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(212, 255, 0, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDraggingBestseller) {
                      e.currentTarget.style.borderColor = '#1c1c1c';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  {/* Top Image Box */}
                  <div 
                    onClick={(e) => {
                      // Only open preview on direct image click, not button clicks
                      if (!e.target.closest('button') && bestsellerDragDistRef.current < 8) {
                        setPreviewProduct(item);
                      }
                    }}
                    style={{
                      height: '240px',
                      background: '#ffffff',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      borderBottom: '1px solid #141414',
                      cursor: 'pointer',
                      padding: '12px'
                    }}
                  >
                    {/* Badge */}
                    {item.badge && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: '#d4ff00',
                        color: '#000000',
                        padding: '2px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        zIndex: 3,
                        textTransform: 'uppercase'
                      }}>
                        {item.badge}
                      </div>
                    )}

                    {/* Floating Vertical 3-Icon Action Buttons (Wishlist, Compare, Preview) */}
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      zIndex: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px',
                      pointerEvents: 'auto'
                    }}>
                      {/* 1. Wishlist */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(item);
                        }}
                        style={{
                          width: '30px',
                          height: '30px',
                          background: isInWishlist(item.id) ? '#ff2d55' : '#d4ff00',
                          border: 'none',
                          color: isInWishlist(item.id) ? '#ffffff' : '#000000',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: isInWishlist(item.id) ? '0 0 10px rgba(255, 45, 85, 0.4)' : 'none'
                        }}
                        title={isInWishlist(item.id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart
                          size={15}
                          fill={isInWishlist(item.id) ? '#ffffff' : 'none'}
                          strokeWidth={2.5}
                        />
                      </button>

                      {/* 2. Compare */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompare(item);
                        }}
                        style={{
                          width: '30px',
                          height: '30px',
                          background: isInCompare(item.id) ? '#00e5ff' : '#d4ff00',
                          border: 'none',
                          color: '#000000',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: isInCompare(item.id) ? '0 0 10px rgba(0, 229, 255, 0.5)' : 'none'
                        }}
                        title={isInCompare(item.id) ? "Remove from comparison" : "Compare product"}
                      >
                        <ArrowLeftRight size={15} strokeWidth={2.5} />
                      </button>

                      {/* 3. Preview (Quick View) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewProduct(item);
                        }}
                        style={{
                          width: '30px',
                          height: '30px',
                          background: '#d4ff00',
                          border: 'none',
                          color: '#000000',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#ffffff'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#d4ff00'}
                        title="Quick Preview"
                      >
                        <Eye size={15} strokeWidth={2.5} />
                      </button>
                    </div>

                    {/* Product Photo */}
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        maxWidth: '85%',
                        maxHeight: '85%',
                        objectFit: 'contain',
                        transition: 'transform 0.4s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                    />
                  </div>

                  {/* Body Content */}
                  <div style={{
                    padding: '1.4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    background: '#000000'
                  }}>
                    {/* Brand */}
                    <div style={{
                      fontSize: '0.82rem',
                      color: '#d4ff00',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.35rem'
                    }}>
                      {item.brand}
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => {
                        if (bestsellerDragDistRef.current < 8) setPreviewProduct(item);
                      }}
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 800,
                        color: '#ffffff',
                        marginBottom: '0.5rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        cursor: 'pointer',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#d4ff00'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                    >
                      {item.name}
                    </h3>

                    {/* Star Rating */}
                    <div style={{ display: 'flex', gap: '3px', marginBottom: '0.65rem' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          fill={i < Math.floor(item.rating || 5) ? '#d4ff00' : 'none'}
                          color={i < Math.floor(item.rating || 5) ? '#d4ff00' : '#444444'}
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>

                    {/* Description Snippet */}
                    <p style={{
                      fontSize: '0.78rem',
                      color: 'rgba(255, 255, 255, 0.65)',
                      lineHeight: 1.5,
                      minHeight: '36px',
                      marginBottom: '1.2rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flex: 1
                    }}>
                      {item.description}
                    </p>

                    {/* Price */}
                    <div style={{
                      fontSize: '1.15rem',
                      fontWeight: 900,
                      color: '#ffffff',
                      marginBottom: '1rem'
                    }}>
                      {item.formattedPrice}
                      {item.formattedComparePrice && (
                        <span style={{
                          fontSize: '0.82rem',
                          color: '#777777',
                          textDecoration: 'line-through',
                          marginLeft: '8px',
                          fontWeight: 500
                        }}>
                          {item.formattedComparePrice}
                        </span>
                      )}
                    </div>

                    {/* Full Width Yellow ADD TO CART Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                          images: [item.image],
                          categoryName: item.brand,
                          description: item.description,
                          rating: item.rating
                        }, 1);
                        setAddedCartId(item.id);
                        setTimeout(() => {
                          setAddedCartId(null);
                        }, 1500);
                      }}
                      style={{
                        width: '100%',
                        background: addedCartId === item.id ? '#10b981' : '#d4ff00',
                        color: addedCartId === item.id ? '#ffffff' : '#000000',
                        fontWeight: 900,
                        fontSize: '0.82rem',
                        letterSpacing: '0.04em',
                        padding: '0.75rem 1rem',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        textTransform: 'uppercase',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (addedCartId !== item.id) {
                          e.currentTarget.style.background = '#e6ff40';
                          e.currentTarget.style.transform = 'scale(1.02)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (addedCartId !== item.id) {
                          e.currentTarget.style.background = '#d4ff00';
                          e.currentTarget.style.transform = 'scale(1)';
                        }
                      }}
                    >
                      {addedCartId === item.id ? (
                        <>
                          <Check size={16} strokeWidth={3} />
                          <span>ADDED TO CART!</span>
                        </>
                      ) : (
                        <>
                          <span>ADD TO CART</span>
                          <ArrowRight size={14} strokeWidth={2.5} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Floating Compare Widget when items are selected */}
      {compareList.length > 0 && (
        <div
          className="animate-fade"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9000,
            background: '#0d111a',
            border: '1px solid #d4ff00',
            borderRadius: '30px',
            padding: '8px 18px',
            boxShadow: '0 12px 35px rgba(0,0,0,0.85), 0 0 20px rgba(212, 255, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeftRight size={16} color="#d4ff00" /> Compare ({compareList.length}/4)
          </span>
          <button
            onClick={() => setCompareModalOpen(true)}
            style={{
              background: '#d4ff00',
              color: '#000000',
              border: 'none',
              borderRadius: '20px',
              padding: '6px 14px',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
          >
            Open Compare
          </button>
        </div>
      )}

      {/* Product Quick View / Preview Modal */}
      <ProductPreviewModal
        product={previewProduct}
        isOpen={!!previewProduct}
        onClose={() => setPreviewProduct(null)}
        onSelectProduct={onSelectProduct}
      />

      {/* End of Home Sections */}
    </div>
  );
};

