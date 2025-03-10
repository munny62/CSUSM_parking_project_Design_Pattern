#pragma once
#include <memory>
#include <vector>
#include "user/User.hpp"
#include "parking/ParkingLot.hpp"
#include "observer/NotificationCenter.hpp"

// Singleton Pattern
class ParkingSystem {
private:
    static ParkingSystem* instance;
    std::vector<std::shared_ptr<ParkingLot>> parkingLots;
    std::vector<std::shared_ptr<User>> users;
    NotificationCenter notificationCenter;
    
    ParkingSystem(); // Private constructor

public:
    static ParkingSystem& getInstance();
    
    void start();
    void registerUser(const std::string& studentId, const std::string& name);
    void addParkingLot(const std::string& name, int capacity);
    std::shared_ptr<User> findUser(const std::string& studentId);
    
    // Delete copy constructor and assignment operator
    ParkingSystem(const ParkingSystem&) = delete;
    void operator=(const ParkingSystem&) = delete;
};