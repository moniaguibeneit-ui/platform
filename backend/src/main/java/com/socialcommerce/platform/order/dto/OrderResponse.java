package com.socialcommerce.platform.order.dto;

import com.socialcommerce.platform.order.entity.Order;
import com.socialcommerce.platform.order.entity.OrderItem;
import com.socialcommerce.platform.order.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record OrderResponse(
        UUID id,
        String orderNumber,
        UUID userId,
        OrderStatus status,
        BigDecimal totalAmount,
        String notes,
        List<ItemResponse> items,
        UUID tenantId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime shippedAt,
        LocalDateTime deliveredAt
) {
    public record ItemResponse(UUID id, UUID productId, String productName, Integer quantity, BigDecimal unitPrice, BigDecimal lineTotal) {}

    public static OrderResponse from(Order o) {
        List<ItemResponse> items = o.getItems() == null ? List.of()
                : o.getItems().stream()
                    .map(i -> new ItemResponse(i.getId(), i.getProductId(), i.getProductName(), i.getQuantity(), i.getUnitPrice(), i.getLineTotal()))
                    .toList();
        return new OrderResponse(
                o.getId(), o.getOrderNumber(), o.getUserId(), o.getStatus(),
                o.getTotalAmount(), o.getNotes(), items, o.getTenantId(),
                o.getCreatedAt(), o.getUpdatedAt(), o.getShippedAt(), o.getDeliveredAt()
        );
    }
}
