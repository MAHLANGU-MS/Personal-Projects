package com.focusflow.dto;
import com.focusflow.model.ReadingMode;
import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSessionRequest {
    private String documentName;
    private ReadingMode readingMode;
}
