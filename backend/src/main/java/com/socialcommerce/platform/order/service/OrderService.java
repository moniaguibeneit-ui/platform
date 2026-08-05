package com.socialcommerce.platform.order.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.socialcommerce.platform.order.dto.OrderRequest;
import com.socialcommerce.platform.order.dto.OrderResponse;
import com.socialcommerce.platform.order.entity.Order;
import com.socialcommerce.platform.order.entity.OrderItem;
import com.socialcommerce.platform.order.entity.OrderStatus;
import com.socialcommerce.platform.order.repository.OrderRepository;
import com.socialcommerce.platform.tenant.context.TenantContext;

import jakarta.persistence.EntityNotFoundException;

/**
 * Order CRUD service (tenant-scoped, SAD ÃÃÃÃÂ§2.5.3, ÃÃÃÃÂ§5.7.4).
 */
@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findAll() {
        return orderRepository.findAll().stream()
                .map(OrderResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse findById(UUID id) {
        return orderRepository.findById(id)
                .map(OrderResponse::from)
                .orElseThrow(() -> new EntityNotFoundException("Order " + id + " not found"));
    }

    public OrderResponse create(OrderRequest req) {
        UUID tenantId = TenantContext.requireTenantId();
        String orderNumber = "ORD-" + System.currentTimeMillis();

        List<OrderItem> items = req.getItems().stream()
                .map(i -> {
                    OrderItem item = new OrderItem();
                    item.setProductId(i.getProductId());
                    item.setProductName(i.getProductName());
                    item.setQuantity(i.getQuantity());
                    item.setUnitPrice(i.getUnitPrice());
                    item.setLineTotal(i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())));
                    return item;
                })
                .toList();

        BigDecimal total = items.stream()
                .map(OrderItem::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .tenantId(tenantId)
                .orderNumber(orderNumber)
                .userId(req.getUserId())
                .status(OrderStatus.PENDING)
                .totalAmount(total)
                .notes(req.getNotes())
                .items(items)
                .build();

        return OrderResponse.from(orderRepository.save(order));
    }

    public OrderResponse updateStatus(UUID id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order " + id + " not found"));
        order.setStatus(status);
        if (status == OrderStatus.SHIPPED && order.getShippedAt() == null) {
            order.setShippedAt(LocalDateTime.now());
        }
        if (status == OrderStatus.DELIVERED && order.getDeliveredAt() == null) {
            order.setDeliveredAt(LocalDateTime.now());
        }
        return OrderResponse.from(orderRepository.save(order));
    }

    public void delete(UUID id) {
        if (!orderRepository.existsById(id)) {
            throw new EntityNotFoundException("Order " + id + " not found");
        }
        orderRepository.deleteById(id);
    }
}
