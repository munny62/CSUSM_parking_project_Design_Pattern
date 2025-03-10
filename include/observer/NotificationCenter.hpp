#pragma once
#include <vector>
#include <memory>
#include "Observer.hpp"

// Observer Pattern
class NotificationCenter {
private:
    std::vector<std::weak_ptr<Observer>> observers;
    
public:
    void addObserver(std::shared_ptr<Observer> observer);
    void removeObserver(std::shared_ptr<Observer> observer);
    void notify(const std::string& message);
};