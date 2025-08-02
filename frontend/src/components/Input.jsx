const Input = ({ icon: Icon, ...props }) => {
    return (
        <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icon className="size-5 text-blue-500" />
            </div>
            <input
                {...props}
                className="w-full pl-10 pr-3 py-2 bg-sky-900/50 rounded-lg border border-sky-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white placeholder-sky-400 transition duration-200 focus:outline-0"
            />
        </div>
    );
};
export default Input;
