import { Button } from "../components/ui/button";

// Example images (replace with your own assets)
const categories = [
    {
        name: "Cleaning Essentials",
        img: "/cleaning.jpeg", // replace with your image path
    },
    {
        name: "Room Supplies",
        img: "/door-lock.jpeg",
    },
    {
        name: "Security",
        img: "/hair-dryer.jpeg",
    },
    {
        name: "Bathroom Accessories",
        img: "/dustbin-2.jpeg",
    },
];

const Home = () => (
    <div className="home-page w-full">
        <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <h1 className="text-6xl uppercase font-bold text-neutral-800 tracking-tight text-center">
                Hotel Supplies
            </h1>
            <p className="text-lg text-neutral-600 text-center">
                Everything you need for your hotel
            </p>
            <Button variant="outline" className="mt-4 cursor-pointer">
                SHOP NOW
            </Button>
        </div>
        <div className="w-full flex justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-5xl px-2 py-8">
                {categories.map((cat) => (
                    <div
                        key={cat.name}
                        className="bg-neutral-50 w-auto h-40 md:h-52 rounded-xl flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition"
                    >
                        <img
                            src={cat.img}
                            alt={cat.name}
                            className="w-full h-full object-cover cursor-pointer hover:brightness-105 transition duration-300 ease-in-out"
                        />
                    </div>
                ))}
            </div>
        </div>
        <div className="w-full py-10 flex flex-col items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 w-full max-w-5xl px-4">
                <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 py-4 md:py-0">
                    <div className="bg-neutral-100 h-12 w-12 flex items-center justify-center rounded-full mb-2 md:mb-4">
                        <img
                            src="/truck.svg"
                            alt="Fast Delivery"
                            className="h-6 w-6"
                        />
                    </div>
                    <h2 className="font-medium text-neutral-800 mb-1 md:mb-2">
                        Bulk & Fast Delivery
                    </h2>
                    <p className="text-neutral-500 text-sm w-[80%] md:w-full">
                        Get wholesale rates and quick delivery for all your hotel and shop supplies. We deliver bulk orders efficiently, so you never run out of essentials.
                    </p>
                </div>
                <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 py-4 md:py-0">
                    <div className="bg-neutral-100 h-12 w-12 flex items-center justify-center rounded-full mb-2 md:mb-4">
                        <img
                            src="/star-badge.svg"
                            alt="Quality Guarantee"
                            className="h-6 w-6"
                        />
                    </div>
                    <h2 className="font-medium text-neutral-800 mb-1 md:mb-2">
                        Quality Assurance
                    </h2>
                    <p className="text-neutral-500 text-sm w-[80%] md:w-full">
                        Trusted by hotels and retailers for premium products. Every item is carefully sourced and quality-checked to meet your business standards.
                    </p>
                </div>
                <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 py-4 md:py-0">
                    <div className="bg-neutral-100 h-12 w-12 flex items-center justify-center rounded-full mb-2 md:mb-4">
                        <img
                            src="/shield-check.svg"
                            alt="Secure Payment"
                            className="h-6 w-6"
                        />
                    </div>
                    <h2 className="font-medium text-neutral-800 mb-1 md:mb-2">
                        Secure Wholesale Payments
                    </h2>
                    <p className="text-neutral-500 text-sm w-[80%] md:w-full">
                        Your business transactions are safe with us. Multiple secure payment options for hassle-free ordering and invoicing.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

export default Home;