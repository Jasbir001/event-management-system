import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Gift, Music, Briefcase, Users, Heart, Mic, ArrowRight } from "lucide-react";

interface EventItem {
  id: number;
  name: string;
  description: string;
  icon: string;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'party': return <Gift className="h-10 w-10 text-pink-500" />;
    case 'music': return <Music className="h-10 w-10 text-purple-500" />;
    case 'briefcase': return <Briefcase className="h-10 w-10 text-blue-500" />;
    case 'users': return <Users className="h-10 w-10 text-orange-500" />;
    case 'heart': return <Heart className="h-10 w-10 text-red-500" />;
    case 'mic': return <Mic className="h-10 w-10 text-indigo-500" />;
    default: return <Gift className="h-10 w-10 text-blue-500" />;
  }
};

const getGradient = (iconName: string) => {
  switch (iconName) {
    case 'party': return "from-pink-50 to-rose-50";
    case 'music': return "from-purple-50 to-fuchsia-50";
    case 'briefcase': return "from-blue-50 to-cyan-50";
    case 'users': return "from-orange-50 to-amber-50";
    case 'heart': return "from-red-50 to-rose-50";
    case 'mic': return "from-indigo-50 to-blue-50";
    default: return "from-blue-50 to-purple-50";
  }
};

const AllEventPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/eventbooks` : '/api/eventbooks';
        const res = await fetch(apiUrl);
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="page-shell pb-24">
      <header className="mb-16 text-center">
        <span className="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 mb-4 ring-1 ring-blue-500/20">
          Our Services
        </span>
        <h1 className="text-4xl font-black tracking-tight text-gray-900 md:text-6xl mb-6">
          Unforgettable <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Experiences</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-500 md:text-xl">
          Discover our range of premium event planning services. We handle all the details so you can enjoy the moment.
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
        </div>
      ) : (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
            <article 
              key={ev.id} 
              className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]"
            >
              <div className={`flex h-48 items-center justify-center bg-gradient-to-br ${getGradient(ev.icon)} p-8 transition-transform duration-500 group-hover:scale-105`}>
                <div className="rounded-full bg-white/80 p-5 shadow-sm backdrop-blur-sm ring-1 ring-white/50 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                  {getIcon(ev.icon)}
                </div>
              </div>
              
              <div className="flex flex-1 flex-col p-8 z-10 bg-white">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{ev.name}</h3>
                <p className="text-gray-500 mb-8 line-clamp-3 flex-1">{ev.description}</p>
                
                <Link 
                  to={`/eventbooked?type=${encodeURIComponent(ev.name)}`} 
                  className="mt-auto group/btn flex items-center justify-center gap-2 rounded-xl bg-gray-50 px-5 py-3 font-semibold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
                >
                  Book This Event
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
          {events.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <p className="text-gray-500 text-lg">No events available right now. Check back soon!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllEventPage;
