#pragma once
#include <string>
#include <memory>
#include "../observer/Observer.hpp"

// Observer Pattern
class User : public Observer {
private:
    std::string studentId;
    std::string name;
    
public:
    User(const std::string& studentId, const std::string& name);
    std::string getStudentId() const;
    std::string getName() const;
    
    // Observer Pattern implementation
    void update(const std::string& message) override;
};