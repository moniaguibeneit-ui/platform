package com.socialcommerce.platform.common.config;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.AbstractBeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionRegistryPostProcessor;
import org.springframework.context.annotation.Configuration;

/**
 * Ensures entityManagerFactory initializes after Flyway migrates the schema.
 */
@Configuration(proxyBeanMethods = false)
public class JpaDependsOnFlyway implements BeanDefinitionRegistryPostProcessor {

    @Override
    public void postProcessBeanDefinitionRegistry(org.springframework.beans.factory.support.BeanDefinitionRegistry registry) {
        // no-op
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        if (!beanFactory.containsBeanDefinition("entityManagerFactory")) {
            return;
        }
        BeanDefinition emf = beanFactory.getBeanDefinition("entityManagerFactory");
        if (emf instanceof AbstractBeanDefinition abd) {
            abd.setDependsOn("flyway");
        }
    }
}
