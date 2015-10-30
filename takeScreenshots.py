# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re

class Neu(unittest.TestCase):
    def setUp(self):
        driver_type = "Chrome"
        if driver_type == "IE":
            self.driver = webdriver.Ie(executable_path="C:\Users\hiwi\Downloads\IEDriverServer.exe")
        elif driver_type == "Chrome":
            self.driver = webdriver.Chrome(executable_path="C:\Users\hiwi\Downloads\chromedriver.exe")
        elif driver_type == "Firefox":
            self.driver = webdriver.Firefox()
        self.driver_type = driver_type
        self.driver.set_window_size(1680, 1050)
        self.driver.implicitly_wait(30)
        self.base_url = "http://localhost:22657/"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_neu(self):
        driver = self.driver
        driver.get(self.base_url + "/")
        for i in range(60):
            try:
                if self.is_element_present(By.XPATH, "//ul[2]/li/a"): break
            except: pass
            time.sleep(1)
        else: self.fail("time out")
        driver.find_element_by_xpath("//ul[2]/li/a").click()
        for i in range(60):
            try:
                if self.is_element_present(By.ID, "username"): break
            except: pass
            time.sleep(1)
        else: self.fail("time out")
        driver.find_element_by_id("username").clear()
        driver.find_element_by_id("username").send_keys("admin")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("admin1234\n")
        print("DONE")
        for i in range(60):
            try:
                if self.is_element_present(By.LINK_TEXT, "Netzwerkmanagement"): break
            except: pass
            time.sleep(1)
        else: self.fail("time out")
        driver.find_element_by_link_text("Netzwerkmanagement").click()
        for i in range(60):
            try:
                if self.is_element_present(By.XPATH, "//div[@id='dashboard']/div/div/div[2]/ul/li[4]/a"): break
            except: pass
            time.sleep(1)
        else: self.fail("time out")
        time.sleep(1)
        driver.find_element_by_xpath("//div[@id='dashboard']/div/div/div[2]/ul/li[4]/a").click()
        for i in range(60):
            try:
                if "EET-Heilbronn-Franken" == driver.find_element_by_css_selector("h2.mart0").text: break
            except: pass
            time.sleep(1)
        else: self.fail("time out")
        driver.get_screenshot_as_file("C:\Users\hiwi\Documents\ORK-Screenshots\Netzwerk-%s.png" % self.driver_type)
        driver.find_element_by_link_text("Albert Berner Deuts...").click()
        for i in range(60):
            try:
                if "Albert Berner Deutschland GmbH" == driver.find_element_by_css_selector("h2.mart0").text: break
            except: pass
            time.sleep(1)
        else: self.fail("time out")
        driver.get_screenshot_as_file("C:\Users\hiwi\Documents\ORK-Screenshots\Unternehmen-%s.png" % self.driver_type)
        for i in range(60):
            try:
                if self.is_element_present(By.XPATH, "//div/div/h3/a[2]/span"): break
            except: pass
            time.sleep(1)
        else: self.fail("time out")
        driver.find_element_by_xpath("//div/div/h3/a[2]/span").click()
        time.sleep(1)
        driver.get_screenshot_as_file("C:\Users\hiwi\Documents\ORK-Screenshots\Maßnhamen-%s.png".decode("utf-8") % self.driver_type)
        for i in range(60):
            try:
                if self.is_element_present(By.XPATH, "//div[@id='infoPanel']/div/h3/span"): break
            except: pass
            time.sleep(1)
        else: self.fail("time out")
        for i in range(60):
            try:
                if self.is_element_present(By.XPATH, "//table[@id='measuresTable']/tbody/tr/td[6]/a/span"): break
            except: pass
            time.sleep(1)
        else: self.fail("time out")
        driver.find_element_by_xpath("//table[@id='measuresTable']/tbody/tr/td[6]/a/span").click()
        time.sleep(1)
        driver.get_screenshot_as_file("C:\Users\hiwi\Documents\ORK-Screenshots\Maßnahme-bearbeiten-%s.png".decode("utf-8") % self.driver_type)
        time.sleep(1)
        driver.find_element_by_xpath("(//button[@type='button'])[13]").click()
        time.sleep(1)
        driver.find_element_by_css_selector("button.close").click()
        time.sleep(1)
        driver.find_element_by_css_selector("a.dropdown-toggle > span").click()
        time.sleep(1)
        driver.find_element_by_link_text("Abmelden").click()
    
    def is_element_present(self, how, what):
        try: self.driver.find_element(by=how, value=what)
        except NoSuchElementException, e: return False
        return True
    
    def is_alert_present(self):
        try: self.driver.switch_to_alert()
        except NoAlertPresentException, e: return False
        return True
    
    def close_alert_and_get_its_text(self):
        try:
            alert = self.driver.switch_to_alert()
            alert_text = alert.text
            if self.accept_next_alert:
                alert.accept()
            else:
                alert.dismiss()
            return alert_text
        finally: self.accept_next_alert = True
    
    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
